<?php

namespace TDW\Test\IPanel\Controller\Operation;

use Fig\Http\Message\StatusCodeInterface as StatusCode;
use PHPUnit\Framework\Attributes as TestAttr;
use TDW\Test\IPanel\Controller\BaseTestCase;

class OperationControllerTest extends BaseTestCase
{
    protected const RUTA_API = '/operations';

    #[TestAttr\Test]
    public function testPostOperationSuccess(): string
    {
        $vueloRandom = 'IB' . rand(1000, 9999);
        $data = [
            'tipo'           => 'VUELO',
            'codigo'         => $vueloRandom,
            'sentido'        => 'SALIDA',
            'origen'         => 'Madrid-Barajas',
            'destino'        => 'Tokio-Narita',
            'horaProgramada' => '2026-12-31 23:50:00',
            'horaEstimada'   => '2027-01-01 00:10:00',
            'estado'         => 'PROGRAMADO',
            'operatorId'     => 1,
            'spotId'         => 1
        ];

        // Ejecutamos la petición simulada
        $response = $this->runApp('POST', self::RUTA_API, $data);

        // ASSERT 1: Código de estado 201 Created
        $this->assertEquals(StatusCode::STATUS_CREATED, $response->getStatusCode());

        $payload = json_decode((string) $response->getBody(), true);
        
        // ASSERT 2: La respuesta contiene el objeto creado
        $this->assertArrayHasKey('operacion', $payload);
        $this->assertEquals($vueloRandom, $payload['operacion']['codigo']);
        $this->assertIsString($payload['operacion']['operationId']);

        return $payload['operacion']['operationId'];
    }

    #[TestAttr\Test]
    #[TestAttr\Depends('testPostOperationSuccess')]
    public function testCGetOperations(): void
    {
        $response = $this->runApp('GET', self::RUTA_API);

        // ASSERT: Código 200 OK
        $this->assertEquals(StatusCode::STATUS_OK, $response->getStatusCode());

        $payload = json_decode((string) $response->getBody(), true);
        
        // ASSERT: La lista no está vacía
        $this->assertArrayHasKey('operaciones', $payload);
        $this->assertNotEmpty($payload['operaciones']);
    }

    #[TestAttr\Test]
    #[TestAttr\Depends('testPostOperationSuccess')]
    public function testGetOperationById(string $ulid): void
    {
        $response = $this->runApp('GET', self::RUTA_API . '/' . $ulid);
        $this->assertEquals(StatusCode::STATUS_OK, $response->getStatusCode());
        $payload = json_decode((string) $response->getBody(), true);
        $this->assertEquals($ulid, $payload['operationId']);
    }

    #[TestAttr\Test]
    #[TestAttr\Depends('testPostOperationSuccess')]
    public function testDeleteOperation(string $ulid): void
    {
        $response = $this->runApp('DELETE', self::RUTA_API . '/' . $ulid);
        $this->assertEquals(StatusCode::STATUS_NO_CONTENT, $response->getStatusCode());
        $responseNotFound = $this->runApp('GET', self::RUTA_API . '/' . $ulid);
        $this->assertEquals(StatusCode::STATUS_NOT_FOUND, $responseNotFound->getStatusCode());
    }
}