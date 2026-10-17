function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is required`)
  }
  return value.trim()
}

export function parseSkillInput(data: Record<string, unknown>) {
  return {
    name: requiredString(data.name, 'name'),
    nameAr: requiredString(data.nameAr, 'nameAr'),
    level: typeof data.level === 'string' && data.level.trim() ? data.level.trim() : 'Intermediate',
    category: requiredString(data.category, 'category'),
    categoryAr: requiredString(data.categoryAr, 'categoryAr'),
    icon: typeof data.icon === 'string' ? data.icon.trim() || null : null,
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : Number(data.sortOrder) || 0,
  }
}

export function parseServiceInput(data: Record<string, unknown>) {
  return {
    title: requiredString(data.title, 'title'),
    titleAr: requiredString(data.titleAr, 'titleAr'),
    description: requiredString(data.description, 'description'),
    descriptionAr: requiredString(data.descriptionAr, 'descriptionAr'),
    icon: typeof data.icon === 'string' && data.icon.trim() ? data.icon.trim() : 'wrench',
    features: typeof data.features === 'string' ? data.features : '[]',
    featuresAr: typeof data.featuresAr === 'string' ? data.featuresAr : '[]',
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : Number(data.sortOrder) || 0,
  }
}

export function parseStatInput(data: Record<string, unknown>) {
  return {
    label: requiredString(data.label, 'label'),
    labelAr: requiredString(data.labelAr, 'labelAr'),
    value: requiredString(data.value, 'value'),
    color: typeof data.color === 'string' && data.color.trim() ? data.color.trim() : 'primary',
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : Number(data.sortOrder) || 0,
  }
}

export function parseIntegrationInput(data: Record<string, unknown>) {
  return {
    name: requiredString(data.name, 'name'),
    nameAr: requiredString(data.nameAr, 'nameAr'),
    description: requiredString(data.description, 'description'),
    descriptionAr: requiredString(data.descriptionAr, 'descriptionAr'),
    icon: typeof data.icon === 'string' && data.icon.trim() ? data.icon.trim() : 'globe',
    category: typeof data.category === 'string' && data.category.trim() ? data.category.trim() : 'api',
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : Number(data.sortOrder) || 0,
  }
}
