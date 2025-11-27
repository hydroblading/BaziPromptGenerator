import { test } from 'node:test';
import assert from 'node:assert';
import { getBaziDetail } from './index.js';

test('Test Bazi output for a girl born on 1996 Feb 4th 11am', async () => {
  // Test data: Girl (gender: 0) born on February 4th, 1996 at 11:00 AM
  const solarDatetime = '1996-02-04T11:00:00+08:00';
  const gender = 0; // 0 for female, 1 for male

  const result = await getBaziDetail({
    solarDatetime,
    gender,
  });

  // Log the full result for inspection
  console.log('\n=== Bazi Calculation Result ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('\n');

  // Basic assertions to verify the structure
  assert(result, 'Result should not be null or undefined');
  assert.strictEqual(result.性别, '女', 'Gender should be female (女)');
  assert(result.八字, '八字 (Eight Characters) should exist');
  assert(result.阳历, '阳历 (Solar date) should exist');
  assert(result.农历, '农历 (Lunar date) should exist');
  assert(result.日主, '日主 (Day Master) should exist');
  assert(result.生肖, '生肖 (Zodiac) should exist');
  
  // Verify the four pillars exist
  assert(result.年柱, '年柱 (Year Pillar) should exist');
  assert(result.月柱, '月柱 (Month Pillar) should exist');
  assert(result.日柱, '日柱 (Day Pillar) should exist');
  assert(result.时柱, '时柱 (Hour Pillar) should exist');
  
  // Verify other components
  assert(result.胎元, '胎元 (Fetal Origin) should exist');
  assert(result.胎息, '胎息 (Fetal Breath) should exist');
  assert(result.命宫, '命宫 (Life Palace) should exist');
  assert(result.身宫, '身宫 (Body Palace) should exist');
  assert(result.神煞, '神煞 (Gods and Demons) should exist');
  assert(result.大运, '大运 (Decade Fortune) should exist');
  assert(result.刑冲合会, '刑冲合会 (Relations) should exist');

  // Verify the solar date contains 1996
  assert(result.阳历.includes('1996'), 'Solar date should contain 1996');

  // Verify the structure of pillars
  assert(result.年柱.天干, 'Year pillar should have 天干 (Heaven Stem)');
  assert(result.年柱.地支, 'Year pillar should have 地支 (Earth Branch)');
  assert(result.月柱.天干, 'Month pillar should have 天干 (Heaven Stem)');
  assert(result.月柱.地支, 'Month pillar should have 地支 (Earth Branch)');
  assert(result.日柱.天干, 'Day pillar should have 天干 (Heaven Stem)');
  assert(result.日柱.地支, 'Day pillar should have 地支 (Earth Branch)');
  assert(result.时柱.天干, 'Hour pillar should have 天干 (Heaven Stem)');
  assert(result.时柱.地支, 'Hour pillar should have 地支 (Earth Branch)');

  console.log('✅ All assertions passed!');
});

