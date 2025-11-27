import { calculateRelation, getShen } from 'cantian-tymext';
import {
  ChildLimit,
  DefaultEightCharProvider,
  EarthBranch,
  EightChar,
  Gender,
  HeavenStem,
  LunarHour,
  LunarSect2EightCharProvider,
  SixtyCycle,
  SolarTime,
} from 'tyme4ts';

const eightCharProvider1 = new DefaultEightCharProvider();
const eightCharProvider2 = new LunarSect2EightCharProvider();

export const buildHideHeavenObject = (heavenStem: HeavenStem | null | undefined, me: HeavenStem) => {
  if (!heavenStem) {
    return undefined;
  }
  return {
    天干: heavenStem.toString(),
    十神: me.getTenStar(heavenStem).toString(),
  };
};

/**
 * @param sixtyCycle 干支。
 * @param me 日主，如果sixtyCycle是日柱的话不传值。
 */
export const buildSixtyCycleObject = (sixtyCycle: SixtyCycle, me?: HeavenStem) => {
  const heavenStem = sixtyCycle.getHeavenStem();
  const earthBranch = sixtyCycle.getEarthBranch();
  if (!me) {
    me = heavenStem;
  }
  return {
    天干: {
      天干: heavenStem.toString(),
      五行: heavenStem.getElement().toString(),
      阴阳: heavenStem.getYinYang() === 1 ? '阳' : '阴',
      十神: me === heavenStem ? undefined : me.getTenStar(heavenStem).toString(),
    },
    地支: {
      地支: earthBranch.toString(),
      五行: earthBranch.getElement().toString(),
      阴阳: earthBranch.getYinYang() === 1 ? '阳' : '阴',
      藏干: {
        主气: buildHideHeavenObject(earthBranch.getHideHeavenStemMain(), me),
        中气: buildHideHeavenObject(earthBranch.getHideHeavenStemMiddle(), me),
        余气: buildHideHeavenObject(earthBranch.getHideHeavenStemResidual(), me),
      },
    },
    纳音: sixtyCycle.getSound().toString(),
    旬: sixtyCycle.getTen().toString(),
    空亡: sixtyCycle.getExtraEarthBranches().join(''),
    星运: me.getTerrain(earthBranch).toString(),
    自坐: heavenStem.getTerrain(earthBranch).toString(),
  };
};

const buildGodsObject = (eightChar: EightChar, gender: 0 | 1) => {
  const gods = getShen(eightChar.toString(), gender);
  return {
    年柱: gods[0],
    月柱: gods[1],
    日柱: gods[2],
    时柱: gods[3],
  };
};

// Five elements relationship: 生 (generate), 克 (overcome)
// 木生火，火生土，土生金，金生水，水生木
// 木克土，土克水，水克火，火克金，金克木
const ELEMENT_GENERATES: Record<string, string> = {
  木: '火',
  火: '土',
  土: '金',
  金: '水',
  水: '木',
};

const ELEMENT_OVERCOMES: Record<string, string> = {
  木: '土',
  土: '水',
  水: '火',
  火: '金',
  金: '木',
};

const ELEMENT_GENERATED_BY: Record<string, string> = {
  木: '水',
  火: '木',
  土: '火',
  金: '土',
  水: '金',
};

const ELEMENT_OVERCOME_BY: Record<string, string> = {
  木: '金',
  土: '木',
  水: '土',
  火: '水',
  金: '火',
};

// Calculate day master strength
const calculateDayMasterStrength = (eightChar: EightChar, me: HeavenStem) => {
  const meElement = me.getElement().toString();
  let sameCount = 0; // 同五行
  let supportCount = 0; // 生助 (generates me or same element)
  let overcomeCount = 0; // 克制 (overcomes me)
  let drainCount = 0; // 泄力 (I generate)
  const details: string[] = [];

  const pillars = [
    { name: '年柱', heavenStem: eightChar.getYear().getHeavenStem(), earthBranch: eightChar.getYear().getEarthBranch() },
    { name: '月柱', heavenStem: eightChar.getMonth().getHeavenStem(), earthBranch: eightChar.getMonth().getEarthBranch() },
    { name: '日柱', heavenStem: eightChar.getDay().getHeavenStem(), earthBranch: eightChar.getDay().getEarthBranch() },
    { name: '时柱', heavenStem: eightChar.getHour().getHeavenStem(), earthBranch: eightChar.getHour().getEarthBranch() },
  ];

  details.push(`日主${me}(${meElement})`);

  for (const pillar of pillars) {
    const hsElement = pillar.heavenStem.getElement().toString();
    const ebElement = pillar.earthBranch.getElement().toString();

    // Check heaven stem
    if (pillar.heavenStem !== me) {
      if (hsElement === meElement) {
        sameCount++;
        supportCount++;
        details.push(`${pillar.name}天干${pillar.heavenStem}与日主同五行，增力`);
      } else if (ELEMENT_GENERATES[hsElement] === meElement) {
        supportCount++;
        details.push(`${pillar.name}天干${pillar.heavenStem}生助日主，增力`);
      } else if (ELEMENT_OVERCOMES[hsElement] === meElement) {
        overcomeCount++;
        details.push(`${pillar.name}天干${pillar.heavenStem}克制日主，减力`);
      } else if (ELEMENT_GENERATES[meElement] === hsElement) {
        drainCount++;
      }
    }

    // Check earth branch
    if (ebElement === meElement) {
      supportCount++;
      details.push(`${pillar.name}地支${pillar.earthBranch}生助日主，增力`);
    } else if (ELEMENT_GENERATES[ebElement] === meElement) {
      supportCount++;
      details.push(`${pillar.name}地支${pillar.earthBranch}生助日主，增力`);
    } else if (ELEMENT_OVERCOMES[ebElement] === meElement) {
      overcomeCount++;
      details.push(`${pillar.name}地支${pillar.earthBranch}克制日主，减力`);
    }

    // Check hidden stems in earth branch
    const hiddenStems = pillar.earthBranch.getHideHeavenStems();
    for (const hiddenStem of hiddenStems) {
      const hiddenHeavenStem = hiddenStem.getHeavenStem();
      const hiddenElement = hiddenHeavenStem.getElement().toString();
      if (hiddenElement === meElement) {
        sameCount++;
        supportCount++;
      } else if (ELEMENT_GENERATES[hiddenElement] === meElement) {
        supportCount++;
      } else if (ELEMENT_OVERCOMES[hiddenElement] === meElement) {
        overcomeCount++;
      }
    }
  }

  details.unshift(`同五行: ${sameCount}个`);
  details.splice(1, 0, `生助: ${supportCount}个`);
  details.splice(2, 0, `克制: ${overcomeCount}个`);
  details.splice(3, 0, `泄力: ${drainCount}个`);

  const score = supportCount - overcomeCount;
  const strength = score > 0 ? '身强' : '身弱';

  return {
    strength,
    score: parseFloat(score.toFixed(1)),
    details,
  };
};

// Determine use gods based on strength
const determineUseGods = (strength: string, meElement: string) => {
  if (strength === '身强') {
    // 身强喜克泄耗 - like to be overcome, drained, or consumed
    const useGods: string[] = [];
    // 克 (overcome me)
    if (ELEMENT_OVERCOME_BY[meElement]) {
      useGods.push(ELEMENT_OVERCOME_BY[meElement]);
    }
    // 泄 (I generate)
    if (ELEMENT_GENERATES[meElement]) {
      useGods.push(ELEMENT_GENERATES[meElement]);
    }
    // 耗 (I overcome)
    if (ELEMENT_OVERCOMES[meElement]) {
      useGods.push(ELEMENT_OVERCOMES[meElement]);
    }
    return {
      useGod: [...new Set(useGods)],
      reason: '根据身强原则确定用神',
      details: ['身强喜克泄耗，用神为' + [...new Set(useGods)].join('、')],
    };
  } else {
    // 身弱喜生扶 - like to be generated or supported
    const useGods: string[] = [];
    // 生 (generates me)
    if (ELEMENT_GENERATED_BY[meElement]) {
      useGods.push(ELEMENT_GENERATED_BY[meElement]);
    }
    // 扶 (same element)
    useGods.push(meElement);
    return {
      useGod: [...new Set(useGods)],
      reason: '根据身弱原则确定用神',
      details: ['身弱喜生扶，用神为' + [...new Set(useGods)].join('、')],
    };
  }
};

// Get lunar year (sixty cycle) for a given solar year
const getLunarYear = (solarYear: number) => {
  try {
    // Use SolarTime to get the correct sixty cycle year for the given solar year
    // Use March 1st to ensure we're past the Spring Festival (立春 around Feb 4-5)
    // The sixty cycle year changes at 立春, not at the calendar year boundary
    const solarTime = SolarTime.fromYmdHms(solarYear, 3, 1, 12, 0, 0);
    const lunarHour = solarTime.getLunarHour();
    const eightChar = lunarHour.getEightChar();
    return eightChar.getYear().toString();
  } catch {
    return '';
  }
};

// Analyze decade fortune with detailed analysis
const analyzeDecadeFortune = (
  decadeFortuneObjects: any[],
  me: HeavenStem,
  useGods: string[],
  strength: string
) => {
  const meElement = me.getElement().toString();
  const analyzed: any[] = [];

  for (const df of decadeFortuneObjects) {
    // Get elements from the decade fortune sixty cycle
    // df.干支 is a string like "庚寅", so we need to parse it
    const ganChar = df.干支[0];
    const zhiChar = df.干支[1];
    const ganStem = HeavenStem.fromName(ganChar);
    const zhiBranch = EarthBranch.fromName(zhiChar);
    const ganElement = ganStem.getElement().toString();
    const zhiElement = zhiBranch.getElement().toString();

    // Check if decade fortune contains use gods
    const useGodTypes: string[] = [];
    if (useGods.includes(ganElement) && !useGodTypes.includes(ganElement)) {
      useGodTypes.push(ganElement);
    }
    if (useGods.includes(zhiElement) && !useGodTypes.includes(zhiElement)) {
      useGodTypes.push(zhiElement);
    }
    
    // Check hidden stems
    const hiddenStemElements: string[] = [];
    for (const hidden of df.地支藏干) {
      try {
        const hiddenStem = HeavenStem.fromName(hidden);
        const hiddenElement = hiddenStem.getElement().toString();
        if (useGods.includes(hiddenElement) && !useGodTypes.includes(hiddenElement)) {
          useGodTypes.push(hiddenElement);
        }
        hiddenStemElements.push(hiddenElement);
      } catch {
        // Ignore invalid hidden stems
      }
    }

    const hasUseGod = useGodTypes.length > 0;

    // Analyze ten stars
    const tenStarName = df.天干十神;
    const keyEvents: string[] = [];
    let score = 0;

    if (hasUseGod) {
      const useGodDesc = useGodTypes.length === 1 
        ? useGodTypes[0] 
        : useGodTypes.join('或');
      keyEvents.push(`大运包含用神${useGodDesc}，运势有利`);
      score += 20;
    }

    // Analyze ten stars
    const favorableTenStars = ['正财', '偏财', '正官', '七杀', '食神', '伤官'];
    const cautionTenStars = ['比肩', '劫财', '偏印', '正印'];

    if (favorableTenStars.includes(tenStarName)) {
      if (['正财', '偏财'].includes(tenStarName)) {
        keyEvents.push(`${tenStarName}出现，${tenStarName === '偏财' ? '需注意' : '有利'}`);
        score += tenStarName === '正财' ? 15 : 0;
      } else if (['正官', '七杀'].includes(tenStarName)) {
        keyEvents.push(`${tenStarName}出现，${tenStarName === '七杀' ? '需注意' : '有利'}`);
        score += tenStarName === '正官' ? 15 : 5;
      } else if (['食神', '伤官'].includes(tenStarName)) {
        keyEvents.push(`${tenStarName}出现，${tenStarName === '伤官' ? '需注意' : '有利'}`);
        score += tenStarName === '食神' ? 15 : 5;
      }
    } else if (cautionTenStars.includes(tenStarName)) {
      if (['比肩', '劫财'].includes(tenStarName)) {
        keyEvents.push(`${tenStarName}出现，需注意`);
        score -= 5;
      } else if (['偏印', '正印'].includes(tenStarName)) {
        keyEvents.push(`${tenStarName}出现，${tenStarName === '偏印' ? '需注意' : '有利'}`);
        score += tenStarName === '正印' ? 10 : -5;
      }
    }

    // Check earth branch ten stars
    for (const zhiTenStar of df.地支十神) {
      if (['正财', '偏财'].includes(zhiTenStar)) {
        if (!keyEvents.some((e) => e.includes(zhiTenStar))) {
          keyEvents.push(`${zhiTenStar}出现，${zhiTenStar === '偏财' ? '需注意' : '有利'}`);
          score += zhiTenStar === '正财' ? 5 : -5;
        }
      } else if (['正官', '七杀'].includes(zhiTenStar)) {
        if (!keyEvents.some((e) => e.includes(zhiTenStar))) {
          keyEvents.push(`${zhiTenStar}出现，${zhiTenStar === '七杀' ? '需注意' : '有利'}`);
          score += zhiTenStar === '正官' ? 5 : -5;
        }
      } else if (['正印'].includes(zhiTenStar)) {
        if (!keyEvents.some((e) => e.includes('正印'))) {
          keyEvents.push('正印出现，有利');
          score += 5;
        }
      }
    }

    // Determine rating
    let rating = '平';
    if (score >= 40) rating = '大吉';
    else if (score >= 25) rating = '吉';
    else if (score >= 10) rating = '平';
    else rating = '凶';

    // Generate lunar years (sixty cycle years)
    const lunarYears: string[] = [];
    for (let year = df.开始年份; year <= df.结束; year++) {
      const yearCycle = getLunarYear(year);
      if (yearCycle) {
        lunarYears.push(`${year}年(${yearCycle})`);
      } else {
        lunarYears.push(`${year}年`);
      }
    }

    analyzed.push({
      大运: df.干支,
      年份: `${df.开始年份}-${df.结束}`,
      年龄: `${df.开始年龄}-${df.结束年龄}岁`,
      评级: rating,
      评分: Math.max(0, Math.min(50, score)),
      分析: `${df.开始年份}-${df.结束}年 (${df.开始年龄}-${df.结束年龄}岁) ${rating}`,
      关键事件: keyEvents.length > 0 ? keyEvents : ['运势平稳'],
      黄历年: lunarYears,
    });
  }

  return analyzed;
};

// Get overall evaluation
const getOverallEvaluation = (strength: string, useGods: string[]) => {
  let pattern = '';
  if (strength === '身强') {
    if (useGods.includes('木') || useGods.includes('水')) {
      pattern = '身强格局，用财，用官';
    } else {
      pattern = '身强格局，用财官';
    }
  } else {
    pattern = '身弱格局，用印比';
  }

  const overallFortune =
    strength === '身强'
      ? '整体运势良好，人生多顺遂，关键时期把握机会'
      : '整体运势需要扶持，宜寻求帮助和支持';

  const recommendations: string[] = [];
  if (strength === '身强') {
    recommendations.push('身强喜克泄耗，适合从事需要竞争和挑战的工作');
    recommendations.push('宜主动出击，把握机会，但需注意控制情绪');
  } else {
    recommendations.push('身弱喜生扶，适合从事需要合作和支持的工作');
    recommendations.push('宜寻求贵人相助，注意身体健康');
  }
  recommendations.push(`用神为${useGods.join('、')}，在相关年份和方位有利`);

  return {
    pattern,
    overallFortune,
    recommendations,
  };
};

const buildDecadeFortuneObject = (solarTime: SolarTime, gender: Gender, me: HeavenStem) => {
  const childLimit = ChildLimit.fromSolarTime(solarTime, gender);

  let decadeFortune = childLimit.getStartDecadeFortune();
  const firstStartAge = decadeFortune.getStartAge();
  const startDate = childLimit.getEndTime();
  const decadeFortuneObjects: any[] = [];
  for (let i = 0; i < 10; i++) {
    const sixtyCycle = decadeFortune.getSixtyCycle();
    const heavenStem = sixtyCycle.getHeavenStem();
    const earthBranch = sixtyCycle.getEarthBranch();
    decadeFortuneObjects.push({
      干支: sixtyCycle.toString(),
      开始年份: decadeFortune.getStartSixtyCycleYear().getYear(),
      结束: decadeFortune.getEndSixtyCycleYear().getYear(),
      天干十神: me.getTenStar(heavenStem).getName(),
      地支十神: earthBranch.getHideHeavenStems().map((heavenStem) => me.getTenStar(heavenStem.getHeavenStem()).getName()),
      地支藏干: earthBranch.getHideHeavenStems().map((heavenStem) => heavenStem.toString()),
      开始年龄: decadeFortune.getStartAge(),
      结束年龄: decadeFortune.getEndAge(),
    });
    decadeFortune = decadeFortune.next(1);
  }

  return {
    起运日期: `${startDate.getYear()}-${startDate.getMonth()}-${startDate.getDay()}`,
    起运年龄: firstStartAge,
    大运: decadeFortuneObjects,
  };
};

export const buildBazi = (options: { lunarHour: LunarHour; eightCharProviderSect?: 1 | 2; gender?: Gender }) => {
  const { lunarHour, eightCharProviderSect = 2, gender = 1 } = options;
  if (eightCharProviderSect === 2) {
    LunarHour.provider = eightCharProvider2;
  } else {
    LunarHour.provider = eightCharProvider1;
  }
  const eightChar = lunarHour.getEightChar();
  const me = eightChar.getDay().getHeavenStem();
  const meElement = me.getElement().toString();

  // Calculate day master strength
  const strengthAnalysis = calculateDayMasterStrength(eightChar, me);

  // Determine use gods
  const useGodAnalysis = determineUseGods(strengthAnalysis.strength, meElement);

  // Build decade fortune
  const decadeFortuneData = buildDecadeFortuneObject(lunarHour.getSolarTime(), gender, me);

  // Analyze decade fortune with detailed analysis
  const analyzedDecadeFortune = analyzeDecadeFortune(
    decadeFortuneData.大运,
    me,
    useGodAnalysis.useGod,
    strengthAnalysis.strength
  );

  // Get overall evaluation
  const overallEvaluation = getOverallEvaluation(strengthAnalysis.strength, useGodAnalysis.useGod);

  return {
    性别: ['女', '男'][gender],
    阳历: lunarHour.getSolarTime().toString(),
    农历: lunarHour.toString(),
    八字: eightChar.toString(),
    生肖: eightChar.getYear().getEarthBranch().getZodiac().toString(),
    日主: me.toString(),
    年柱: buildSixtyCycleObject(eightChar.getYear(), me),
    月柱: buildSixtyCycleObject(eightChar.getMonth(), me),
    日柱: buildSixtyCycleObject(eightChar.getDay()),
    时柱: buildSixtyCycleObject(eightChar.getHour(), me),
    胎元: eightChar.getFetalOrigin().toString(),
    胎息: eightChar.getFetalBreath().toString(),
    命宫: eightChar.getOwnSign().toString(),
    身宫: eightChar.getBodySign().toString(),
    神煞: buildGodsObject(eightChar, gender),
    大运: decadeFortuneData,
    刑冲合会: calculateRelation({
      年: { 天干: eightChar.getYear().getHeavenStem().toString(), 地支: eightChar.getYear().getEarthBranch().toString() },
      月: { 天干: eightChar.getMonth().getHeavenStem().toString(), 地支: eightChar.getMonth().getEarthBranch().toString() },
      日: { 天干: eightChar.getDay().getHeavenStem().toString(), 地支: eightChar.getDay().getEarthBranch().toString() },
      时: { 天干: eightChar.getHour().getHeavenStem().toString(), 地支: eightChar.getHour().getEarthBranch().toString() },
    }),
    确定性分析: {
      日主强弱: strengthAnalysis,
      用神分析: useGodAnalysis,
      大运分析: analyzedDecadeFortune,
      总体评价: overallEvaluation,
    },
  };
};
