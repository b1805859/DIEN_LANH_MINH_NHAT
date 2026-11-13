// Categories select existing catalogue routes; no duplicate service definitions.
export const equipmentGroups = [
  {
    id: 'air-conditioner',
    label: 'Máy lạnh',
    heading: 'Dịch vụ máy lạnh',
    icon: 'airvent',
    slugs: [
      'sua-may-lanh',
      've-sinh-may-lanh',
      'thao-di-doi-may-lanh',
      'lap-dat-may-lanh',
    ],
  },
  {
    id: 'washer',
    label: 'Máy giặt',
    heading: 'Dịch vụ máy giặt',
    icon: 'washer',
    slugs: ['sua-may-giat', 've-sinh-may-giat'],
  },
  {
    id: 'fridge',
    label: 'Tủ lạnh',
    heading: 'Dịch vụ tủ lạnh',
    icon: 'fridge',
    slugs: ['sua-tu-lanh'],
  },
  {
    id: 'utilities',
    label: 'Điện nước dân dụng',
    heading: 'Dịch vụ điện nước',
    icon: 'plug',
    slugs: ['sua-dien-nuoc'],
  },
  {
    id: 'drinking-water',
    label: 'Máy nước uống nóng lạnh',
    heading: 'Máy nước uống nóng lạnh',
    icon: 'droplet',
    slugs: ['sua-lap-may-nuoc-uong-nong-lanh'],
  },
  {
    id: 'water-heater',
    label: 'Máy nước nóng lạnh tắm',
    heading: 'Máy nước nóng lạnh tắm',
    icon: 'droplet',
    slugs: ['sua-lap-may-nuoc-nong-lanh-tam'],
  },
] as const;
