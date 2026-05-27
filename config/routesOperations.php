<?php

use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use TDW\IPanel\Controller\Operation\OperationCommandController;
use TDW\IPanel\Controller\Operation\OperationQueryController;
use TDW\IPanel\Middleware\JwtMiddleware;

return function (App $app) {
    // Grupo de rutas para /operations
    $app->group('/operations', function (RouteCollectorProxy $group) {
        
        // GET y OPTIONS para leer todas las operaciones
        $group->get('', [OperationQueryController::class, 'cget'])->setName('api_operations_cget');
        $group->options('', [OperationQueryController::class, 'options'])->setName('api_operations_options');
        
        // POST para crear una operación
        $group->post('', [OperationCommandController::class, 'post'])->setName('api_operations_post')->add(JwtMiddleware::class);
        
        // Rutas con el ID de la operación (ULID)
        $group->group('/{operacionId}', function (RouteCollectorProxy $group) {
            $group->get('', [OperationQueryController::class, 'get'])->setName('api_operations_get');
            $group->put('', [OperationCommandController::class, 'put'])->setName('api_operations_put')->add(JwtMiddleware::class);
            $group->delete('', [OperationCommandController::class, 'delete'])->setName('api_operations_delete')->add(JwtMiddleware::class);
            $group->options('', [OperationQueryController::class, 'options'])->setName('api_operations_options_id');
        });
    });
};