import * as Scopes from '..';
const PermissionsData = require('../../../../database/data/seed/permissions.seed.json');


describe('Scopes', () => {

  describe('stringToScopes', () => {

    PermissionsData.permissions.forEach((permission: string) => {

      test(`${permission} is valid`, () => {
        expect(Scopes.stringToScope(permission)).toEqual(expect.objectContaining({
          access: expect.stringContaining(''),
          resource: expect.stringContaining(''),
          permissionLevel: expect.stringContaining(''),
        }));
      });

    });

  });

  describe('intersect', () => {
    test('both empty arrays return false', () => {
      expect(Scopes.intersect([], [])).toBe(false);
    });

    test('left empty returns false', () => {
      expect(Scopes.intersect([], PermissionsData.permissions)).toBe(false);
    });

    test('right empty returns false', () => {
      expect(Scopes.intersect(PermissionsData.permissions, [])).toBe(false);
    });

    test('neither empty, no intersection returns false', () => {
      expect(
        Scopes.intersect(
          PermissionsData.permissions.slice(0, 3),
          PermissionsData.permissions.slice(3)
        )
      ).toBe(false);
    });

    test('neither empty, with intersection returns true', () => {
      expect(
        Scopes.intersect(
          PermissionsData.permissions.slice(0, 5),
          PermissionsData.permissions.slice(3)
        )
      ).toBe(true);
    });
  });

});
