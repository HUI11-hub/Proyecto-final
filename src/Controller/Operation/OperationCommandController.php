<?php

namespace TDW\IPanel\Controller\Operation;

use DateTime;
use Doctrine\ORM\EntityManager;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Enum\{EstadoOperacion, SentidoOperacion, TipoOperacion};
use TDW\IPanel\Model\{Operacion, Operador, Punto};
use TDW\IPanel\Utility\Error;
use Throwable;

class OperationCommandController
{
    use TraitController;

    public function __construct(
        protected EntityManager $entityManager
    ) { }

    // POST
    public function post(Request $request, Response $response): Response
    {
        $reqData = $request->getParsedBody() ?? json_decode($request->getBody()->getContents(), true);

        if (!isset($reqData['tipo'], $reqData['codigo'], $reqData['sentido'], $reqData['origen'], $reqData['destino'], $reqData['operatorId'], $reqData['spotId'])) {
            return Error::createResponse($response, StatusCode::STATUS_UNPROCESSABLE_ENTITY);
        }

        $operador = $this->entityManager->getRepository(Operador::class)->find($reqData['operatorId']);
        $punto = $this->entityManager->getRepository(Punto::class)->find($reqData['spotId']);

        if (!$operador || !$punto) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }

        try {
            $tipo = TipoOperacion::from(strtolower($reqData['tipo']));
            $sentido = SentidoOperacion::from(strtolower($reqData['sentido']));
            $estado = isset($reqData['estado']) ? EstadoOperacion::from(strtolower($reqData['estado'])) : EstadoOperacion::PROGRAMADO;
            $hp = !empty($reqData['horaProgramada']) ? new DateTime($reqData['horaProgramada']) : null;
            $he = !empty($reqData['horaEstimada']) ? new DateTime($reqData['horaEstimada']) : null;
            $operacion = new Operacion($tipo, $reqData['codigo'], $sentido, $reqData['origen'], $reqData['destino'], $operador, $punto, $estado, $hp, $he);            
            $this->entityManager->persist($operacion);
            $this->entityManager->flush();

            return $response->withJson($operacion, StatusCode::STATUS_CREATED)
                            ->withHeader('Location', '/api/v1/operations/' . $operacion->getId());

        } catch (Throwable $e) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }

    // PUT
    public function put(Request $request, Response $response, array $args): Response
    {
        $operacion = $this->entityManager->getRepository(Operacion::class)->find($args['operationId']);
        
        if (!$operacion) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $reqData = $request->getParsedBody() ?? json_decode($request->getBody()->getContents(), true);

        try {
            if (isset($reqData['tipo'])) $operacion->setTipo($reqData['tipo']);
            if (isset($reqData['codigo'])) $operacion->setCodigo($reqData['codigo']);
            if (isset($reqData['sentido'])) $operacion->setSentido($reqData['sentido']);
            if (isset($reqData['origen'])) $operacion->setOrigen($reqData['origen']);
            if (isset($reqData['destino'])) $operacion->setDestino($reqData['destino']);
            if (isset($reqData['estado'])) $operacion->setEstado($reqData['estado']);
            
            if (isset($reqData['horaProgramada'])) $operacion->setHoraProgramada(new DateTime($reqData['horaProgramada']));
            if (isset($reqData['horaEstimada'])) $operacion->setHoraEstimada(new DateTime($reqData['horaEstimada']));

            if (isset($reqData['operatorId'])) {
                $operador = $this->entityManager->getRepository(Operador::class)->find($reqData['operatorId']);
                if ($operador) $operacion->setOperador($operador);
            }
            if (isset($reqData['spotId'])) {
                $punto = $this->entityManager->getRepository(Punto::class)->find($reqData['spotId']);
                if ($punto) $operacion->setPunto($punto);
            }

            $this->entityManager->flush();

            return $response->withJson($operacion, 209); // 209 Content Returned

        } catch (Throwable $e) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }

    // DELETE
    public function delete(Request $request, Response $response, array $args): Response
    {
        $operacion = $this->entityManager->getRepository(Operacion::class)->find($args['operationId']);
        
        if (!$operacion) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $this->entityManager->remove($operacion);
        $this->entityManager->flush();

        return $response->withStatus(StatusCode::STATUS_NO_CONTENT); // 204
    }
}