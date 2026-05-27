<?php

/**
 * src/Controller/Spot/SpotCommandController.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

namespace TDW\IPanel\Controller\Spot;

use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Enum\TipoPunto;
use TDW\IPanel\Model\Punto;
use TDW\IPanel\Utility\Error;

/**
 * Class SpotCommandController
 */
class SpotCommandController
{
    use TraitController;

    // constructor - receives the EntityManager from container instance
    public function __construct(
        protected ORM\EntityManager $entityManager
    ) { }

    /**
     * Summary: Creates a new Spot
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     * @throws ORM\Exception\ORMException
     */
    public function post(Request $request, Response $response): Response
    {
        assert($request->getMethod() === 'POST');
        if (!$this->checkGestorScope($request)) { // 403 => 404 por seguridad
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $req_data = (array) $request->getParsedBody();

        $tipo = TipoPunto::tryFrom(strtoupper((string) ($req_data['tipo'] ?? '')));
        if ($tipo === null || !$this->verifyStringInput($req_data['codigo'] ?? '', 10)) {  // 422 - Faltan datos o exceden los límites
            return Error::createResponse($response, StatusCode::STATUS_UNPROCESSABLE_ENTITY);
        }

        // hay datos -> procesarlos comprobando que no exista ya el codigo
        $opRepository = $this->entityManager->getRepository(Punto::class);
        $opExists = $this->findByAttribute($opRepository, 'codigo', $req_data['codigo']);
        // STATUS_BAD_REQUEST 400: element name already exists
        if ($opExists !== 0) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }

        // 201
        $element = new Punto($tipo->value, $req_data['codigo']);
        $this->entityManager->persist($element);
        $this->entityManager->flush();

        return $response
            ->withAddedHeader(
                'Location',
                $request->getUri() . '/' . $element->getId()
            )
            ->withJson($element, StatusCode::STATUS_CREATED);
    }

    /**
     * Summary: Updates an element
     *
     * @param Request $request
     * @param Response $response
     * @param array<string, mixed> $args
     * @return Response
     * @throws ORM\Exception\ORMException
     */
    public function put(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'PUT');
        if (!$this->checkGestorScope($request)) { // 403 => 404 por seguridad
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $req_data = (array) $request->getParsedBody();
        // recuperar el elemento
        if (!$this->verifyInputId($args['spotId'] ?? 0)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }
        $this->entityManager->beginTransaction();
        /** @var Punto|null $element */
        $element = $this->entityManager->getRepository(Punto::class)->find($args['spotId']);

        if (!$element instanceof Punto) {    // 404
            $this->entityManager->rollback();
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        // Optimistic Locking (strong validation) - https://httpwg.org/specs/rfc6585.html#status-428
        $etag = md5((string) json_encode($element));
        $ifMatch = trim(current($request->getHeader('If-Match')));
        if ($ifMatch !== $etag) {
            $this->entityManager->rollback();
            return Error::createResponse($response, StatusCode::STATUS_PRECONDITION_REQUIRED);   // 428
        }

        // Update element type
        if (isset($req_data['tipo'])) {
            $tipo = TipoPunto::tryFrom(strtoupper((string) $req_data['tipo']));
            if ($tipo === null) {
                $this->entityManager->rollback();
                return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
            }
            $element->setTipo($tipo->value);
        }

        // Update element code
        if (isset($req_data['codigo']) && $this->verifyStringInput($req_data['codigo'], 10)) { // 400
            $elementId = $this->findByAttribute(
                $this->entityManager->getRepository(Punto::class),
                'codigo',
                $req_data['codigo']
            );
            if (($elementId !== 0) && (intval($args['spotId']) !== $elementId)) {
                // 400 BAD_REQUEST: element code already exists
                $this->entityManager->rollback();
                return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
            }
            $element->setCodigo($req_data['codigo']);
        }

        $this->entityManager->flush();
        $this->entityManager->commit();

        return $response
            ->withStatus(209, 'Content Returned')
            ->withJson($element);
    }

    /**
     * Summary: Remove an item
     *
     * @param Request $request
     * @param Response $response
     * @param array<string, mixed> $args
     * @return Response
     * @throws ORM\Exception\ORMException
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'DELETE');
        if (!$this->checkGestorScope($request)) { // 403 => 404 por seguridad
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        if (!$this->verifyInputId($args['spotId'] ?? 0)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }
        $element = $this->entityManager->getRepository(Punto::class)->find($args['spotId']);

        if (!$element instanceof Punto) {    // 404
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $this->entityManager->remove($element);
        $this->entityManager->flush();

        return $response
            ->withStatus(StatusCode::STATUS_NO_CONTENT);  // 204
    }
}
