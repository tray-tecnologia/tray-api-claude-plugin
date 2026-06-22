import { describe, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { validatePayload } from '../../scripts/lib/validate-schema.mjs';
import { assertOracleAgrees } from './helpers/ajv-oracle.mjs';
import create from '../../skills/variacoes/schemas/variacao.create.json' with { type: 'json' };
import update from '../../skills/variacoes/schemas/variacao.update.json' with { type: 'json' };

describe('variacoes — variacao.create', () => {
  const v = (p) => validatePayload(create, p);

  test('válido — mínimo (product_id + type_1 + value_1)', () => {
    assert.deepEqual(v({ product_id: 1, type_1: 'Cor', value_1: 'Azul' }), []);
  });

  test('válido — com price', () => {
    assert.deepEqual(v({ product_id: 1, type_1: 'Cor', value_1: 'Azul', price: 49.9 }), []);
  });

  test('válido — 2 eixos (type_2/value_2)', () => {
    assert.deepEqual(
      v({ product_id: 1, type_1: 'Cor', value_1: 'Azul', type_2: 'Tamanho', value_2: 'M' }),
      [],
    );
  });

  test('válido — com stock', () => {
    assert.deepEqual(v({ product_id: 1, type_1: 'Cor', value_1: 'Azul', stock: 100 }), []);
  });

  test('inválido — faltam type_1/value_1', () => {
    assert.equal(v({ product_id: 1 }).length, 2);
  });

  test('inválido — falta product_id', () => {
    assert.equal(v({ type_1: 'Cor', value_1: 'Azul' }).length, 1);
  });

  test('inválido — price negativo', () => {
    assert.equal(v({ product_id: 1, type_1: 'Cor', value_1: 'Azul', price: -1 }).length, 1);
  });

  test('inválido — price string', () => {
    assert.equal(v({ product_id: 1, type_1: 'Cor', value_1: 'Azul', price: '1' }).length, 1);
  });

  test('inválido — campo extra', () => {
    assert.equal(v({ product_id: 1, type_1: 'Cor', value_1: 'Azul', extra: 1 }).length, 1);
  });

  test('oracle: válido', () => {
    assertOracleAgrees(create, { product_id: 1, type_1: 'Cor', value_1: 'Azul' }, validatePayload);
  });
});

describe('variacoes — variacao.update', () => {
  const v = (p) => validatePayload(update, p);

  test('válido — só price', () => assert.deepEqual(v({ price: 49 }), []));
  test('válido — só stock', () => assert.deepEqual(v({ stock: 5 }), []));
  test('válido — type_1/value_1', () => assert.deepEqual(v({ type_1: 'Cor', value_1: 'Azul' }), []));
  test('válido — vazio', () => assert.deepEqual(v({}), []));
  test('inválido — type errado', () => assert.equal(v({ price: '1' }).length, 1));
  test('inválido — extra', () => assert.equal(v({ price: 1, extra: 1 }).length, 1));
});
