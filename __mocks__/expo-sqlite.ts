// __mocks__/expo-sqlite.js
module.exports = {
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(cb => cb && cb({
      executeSql: jest.fn((sql, args, ok, err) => ok && ok(null, { rows: { length: 0, _array: [] } })),
    })),
    closeAsync: jest.fn(),
  })),
};
