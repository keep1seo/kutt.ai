/**
 * 格式化时间戳为可读的时间字符串
 * @param timestamp 时间戳（秒级或毫秒级）
 * @param format 时间格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatTimestamp(
  timestamp: string | number | null | undefined,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  if (!timestamp) {
    return '--'
  }

  // 转换为数字
  let ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp

  // 如果是 NaN 或无效值，返回默认值
  if (isNaN(ts) || ts === 0) {
    return '--'
  }

  // 判断是秒级还是毫秒级时间戳（秒级时间戳通常是10位，毫秒级是13位）
  if (ts < 10000000000) {
    ts = ts * 1000 // 秒级时间戳转换为毫秒级
  }

  const date = new Date(ts)

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '--'
  }

  // 格式化日期
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化时间戳为相对时间（例如：1小时前、3天前）
 * @param timestamp 时间戳（秒级或毫秒级）
 * @returns 相对时间字符串
 */
export function formatRelativeTime(
  timestamp: string | number | null | undefined
): string {
  if (!timestamp) {
    return '--'
  }

  // 转换为数字
  let ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp

  // 如果是 NaN 或无效值，返回默认值
  if (isNaN(ts) || ts === 0) {
    return '--'
  }

  // 判断是秒级还是毫秒级时间戳
  if (ts < 10000000000) {
    ts = ts * 1000
  }

  const date = new Date(ts)

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '--'
  }

  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return `${years}年前`
  } else if (months > 0) {
    return `${months}个月前`
  } else if (days > 0) {
    return `${days}天前`
  } else if (hours > 0) {
    return `${hours}小时前`
  } else if (minutes > 0) {
    return `${minutes}分钟前`
  } else {
    return '刚刚'
  }
}

