'use client'

import { useState } from 'react'

export default function Home() {
  const [gender, setGender] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('')
  const [minute, setMinute] = useState('0')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [showOutput, setShowOutput] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!gender || !year || !month || !day || !hour) {
      setMessage({ text: '请填写所有必填字段', type: 'error' })
      setTimeout(() => setMessage(null), 5000)
      return
    }

    // 构建日期时间字符串 (ISO格式，使用北京时间 +08:00)
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+08:00`

    setLoading(true)
    setShowOutput(false)
    setMessage({ text: '正在生成Prompt数据，请稍候...', type: 'success' })

    try {
      const response = await fetch('/api/bazi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          solarDatetime: dateStr,
          gender: parseInt(gender),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '生成失败')
      }

      const formattedOutput = JSON.stringify(data, null, 2)
      setOutput(formattedOutput)
      setShowOutput(true)
      setMessage({ text: 'Prompt数据生成成功！可直接复制使用', type: 'success' })
      
      // 自动滚动到输出区域
      setTimeout(() => {
        document.getElementById('outputSection')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    } catch (error: any) {
      setMessage({ text: '错误: ' + error.message, type: 'error' })
      setShowOutput(false)
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleCopy = async () => {
    if (output) {
      try {
        await navigator.clipboard.writeText(output)
        const copyBtn = document.getElementById('copyBtn')
        if (copyBtn) {
          const originalText = copyBtn.textContent
          copyBtn.textContent = '已复制！'
          setTimeout(() => {
            if (copyBtn) copyBtn.textContent = originalText
          }, 2000)
        }
      } catch (err: any) {
        alert('复制失败: ' + err.message)
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🔮 八字Prompt生成器</h1>
        <p>输入出生信息，生成格式化的八字数据，可直接用作GPT/DS等AI模型的输入Prompt</p>
      </div>

      <div className="content">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">性别 *</label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">请选择</option>
                  <option value="0">女</option>
                  <option value="1">男</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">出生年份 *</label>
                <input
                  type="number"
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="1900"
                  max="2100"
                  placeholder="例如: 1996"
                />
              </div>

              <div className="form-group">
                <label htmlFor="month">出生月份 *</label>
                <input
                  type="number"
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                  min="1"
                  max="12"
                  placeholder="例如: 2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="day">出生日期 *</label>
                <input
                  type="number"
                  id="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                  min="1"
                  max="31"
                  placeholder="例如: 4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hour">出生时辰 *</label>
                <input
                  type="number"
                  id="hour"
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  required
                  min="0"
                  max="23"
                  placeholder="例如: 11 (24小时制)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="minute">分钟</label>
                <input
                  type="number"
                  id="minute"
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  min="0"
                  max="59"
                  placeholder="例如: 0"
                />
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? '生成中...' : '生成Prompt数据'}
            </button>
          </form>
        </div>

        {message && (
          <div className={message.type === 'error' ? 'error' : message.type === 'success' && loading ? 'loading' : 'success'}>
            {message.text}
          </div>
        )}

        {showOutput && (
          <div className="output-section" id="outputSection">
            <div className="output-header">
              <h2>生成的Prompt数据</h2>
              <button className="copy-btn" id="copyBtn" onClick={handleCopy}>
                复制 JSON
              </button>
            </div>
            <div className="output">{output}</div>
          </div>
        )}
      </div>
    </div>
  )
}

