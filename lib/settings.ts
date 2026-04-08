import { prisma } from "@/lib/db"

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key }
    })
    if (!record) return defaultValue
    return record.value as unknown as T
  } catch (error) {
    return defaultValue
  }
}

export async function setSetting(key: string, value: any) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  })
}
