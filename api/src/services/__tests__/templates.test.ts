const templateJson = require('../templates.json');

type templateFixture = {
  testName: string,
  templateId: string,
  value: object,
};
const templateFixtures: templateFixture[] = Object.entries(templateJson)
  .map(([templateId, value]) => ({
    testName: `Template ${templateId}`,
    templateId,
    value,
  }));

describe('Email Templates', () => {
  templateFixtures.forEach((fixture) => {
    test(fixture.testName, async () => {
      expect(Object.keys(fixture.value))
        .toEqual(expect.arrayContaining(['description', 'remoteId']));
      expect(Number(fixture.templateId)).toBeTruthy();
    });
  });
});
