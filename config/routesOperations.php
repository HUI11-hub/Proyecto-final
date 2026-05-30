<?php

use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use TDW\IPanel\Controller\Operation\OperationCommandController;
use TDW\IPanel\Controller\Operation\OperationQueryController;
use TDW\IPanel\Middleware\JwtMiddleware;

return function (App $app) {
    $rutaApi = $_ENV['RUTA_API'] ?? '/api/v1';

    // Grupo de rutas para /api/v1/operations
    $app->group($rutaApi . OperationQueryController::PATH_OPERATIONS, function (RouteCollectorProxy $group) {
        
        // GET y HEAD para leer todas las operaciones
        $group->map(['GET', 'HEAD'], '', [OperationQueryController::class, 'cget'])->setName('api_operations_cget');
        $group->options('', [OperationQueryController::class, 'options'])->setName('api_operations_options');
        
        // POST para crear una operación (Requiere autenticación)
        $group->post('', [OperationCommandController::class, 'post'])
            ->setName('api_operations_post')
            ->add(JwtMiddleware::class);

        // Rutas con el ID de la operación (ULID - 26 caracteres alfanuméricos)
        $group->group('/{operacionId:[0-9A-Za-z]{26}}', function (RouteCollectorProxy $group) {
            // GET y HEAD para leer una operación
            $group->map(['GET', 'HEAD'], '', [OperationQueryController::class, 'get'])->setName('api_operations_get');
            
            $group->put('', [OperationCommandController::class, 'put'])
                ->setName('api_operations_put')
                ->add(JwtMiddleware::class);
                
            $group->delete('', [OperationCommandController::class, 'delete'])
                ->setName('api_operations_delete')
                ->add(JwtMiddleware::class);
                
            $group->options('', [OperationQueryController::class, 'options'])->setName('api_operations_options_id');
        });
    });
};