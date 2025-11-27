import { NextRequest, NextResponse } from 'next/server'
import { getBaziDetail } from '@/src/index'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { solarDatetime, lunarDatetime, gender, eightCharProviderSect } = body

    if (!solarDatetime && !lunarDatetime) {
      return NextResponse.json(
        { error: 'solarDatetime和lunarDatetime必须传且只传其中一个。' },
        { status: 400 }
      )
    }

    const result = await getBaziDetail({
      solarDatetime,
      lunarDatetime,
      gender,
      eightCharProviderSect,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Bazi calculation error:', error)
    return NextResponse.json(
      { error: error.message || '计算失败' },
      { status: 500 }
    )
  }
}

