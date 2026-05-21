<?php

namespace TDW\IPanel\Controller\Operation;

use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManager;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use Slim\Routing\RouteContext;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Model\Operacion;
use TDW\IPanel\Utility\Error;

class OperationQueryController
{
    use TraitController;

    const string PATH_OPERATIONS = '/operations';

    public function __construct(
        protected readonly EntityManager $entityManager
    ) { }

    public function cget(Request $request, Response $response): Response
    {
        assert(in_array($request->getMethod(), [ 'GET', 'HEAD' ], true));
        $params = $request->getQueryParams();
        $criteria = $this->buildCriteria($params);

        $elements = $this->entityManager
            ->getRepository(Operacion::class)
            ->matching($criteria)
            ->getValues();

        if (0 === count($elements)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag = md5((string) json_encode($elements));
        if ($request->hasHeader('If-None-Match') && in_array($etag, $request->getHeader('If-None-Match'), true)) {
            return $response->withStatus(StatusCode::STATUS_NOT_MODIFIED);
        }

        return $response
            ->withAddedHeader('ETag', $etag)
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson([ 'operaciones' => $elements ]);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        assert(in_array($request->getMethod(), [ 'GET', 'HEAD' ], true));
        
        $id = $args['operationId'] ?? '';
        
        $element = $this->entityManager->getRepository(Operacion::class)->find($id);
        
        if (!$element instanceof Operacion) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag = md5((string) json_encode($element));
        if ($request->hasHeader('If-None-Match') && in_array($etag, $request->getHeader('If-None-Match'), true)) {
            return $response->withStatus(StatusCode::STATUS_NOT_MODIFIED);
        }

        return $response
            ->withAddedHeader('ETag', $etag)
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson($element);
    }

    public function options(Request $request, Response $response): Response
    {
        assert($request->getMethod() === 'OPTIONS');
        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $methods = $routingResults->getAllowedMethods();

        return $response
            ->withStatus(204)
            ->withAddedHeader('Cache-Control', 'private')
            ->withAddedHeader(
                'Allow',
                implode(',', $methods)
            );
    }

    private function buildCriteria(array $params): Criteria
    {
        $criteria = new Criteria();
        $order = $params['order'] ?? 'operacionId';
        $ordering = (isset($params['ordering']) && $params['ordering'] === 'DESC') ? 'DESC' : 'ASC';
        
        $criteria->orderBy([$order => $ordering]);

        return $criteria;
    }
}