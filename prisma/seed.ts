import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const properties = [
  {
    code: 'FLN001',
    name: 'Apartamento Beira-Mar Florianópolis',
    propertyType: 'Apartamento',
    bedroomQuantity: 2,
    bathroomQuantity: 1,
    guestCapacity: 4,
    street: 'Rua Lauro Linhares',
    number: '589',
    complement: 'Apto 301',
    neighborhood: 'Trindade',
    city: 'Florianópolis',
    state: 'SC',
    postalCode: '88036-001',
    wifiNetwork: 'SeaHome_FLN001',
    wifiPassword: 'floripa2024',
    isSelfCheckin: true,
    accessType: 'smart_lock',
    accessInstructions: 'Use o código 4521 na fechadura eletrônica',
    accessPassword: '4521',
    hasParking: true,
    parkingIdentifier: 'Vaga 12 — subsolo B1',
    parkingInstructions: 'Portão lateral, código 7890 no interfone',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    allowPet: false,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: true,
    eventsPermitted: false,
    amenities: {
      wifi: true,
      tv: true,
      air_conditioning: true,
      kitchen: true,
      washing_machine: true,
      elevator: true,
      balcony: true,
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    hostName: 'Ana Paula',
    hostPhone: '+5548991234567',
  },
  {
    code: 'GRM001',
    name: 'Chalé Serra Gramado',
    propertyType: 'Casa',
    bedroomQuantity: 3,
    bathroomQuantity: 2,
    guestCapacity: 6,
    street: 'Rua das Hortênsias',
    number: '220',
    complement: null,
    neighborhood: 'Planalto',
    city: 'Gramado',
    state: 'RS',
    postalCode: '95670-000',
    wifiNetwork: 'ChaletSerra_GRM',
    wifiPassword: 'gramado@2024',
    isSelfCheckin: false,
    accessType: 'keybox',
    accessInstructions: 'A chave está no cofre na entrada. Código: 1983',
    accessPassword: '1983',
    hasParking: true,
    parkingIdentifier: null,
    parkingInstructions: 'Garagem própria para 2 carros',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    allowPet: true,
    smokingPermitted: false,
    suitableForChildren: true,
    suitableForBabies: false,
    eventsPermitted: false,
    amenities: {
      wifi: true,
      tv: true,
      kitchen: true,
      bbq_grill: true,
      balcony: true,
      dishwasher: true,
    },
    images: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
    ],
    hostName: 'Carlos Eduardo',
    hostPhone: '+5554998765432',
  },
]

const fln001Guide = {
  welcomeMessage:
    'Bem-vindo a Florianópolis! Seu apartamento fica no coração da Trindade, a poucos minutos das principais atrações da ilha. Aproveite as praias, a gastronomia local e a natureza exuberante.',
  restaurants: [
    {
      name: 'Box 32',
      distance: 'Aprox. 1,2 km',
      description:
        'Boteco tradicional de Florianópolis, famoso pelos petiscos e pela sequência de camarão.',
    },
    {
      name: 'Armazém Vieira',
      distance: 'Aprox. 2,5 km',
      description:
        'Referência em frutos do mar desde 1958, com vista para o mangue.',
    },
    {
      name: 'Botanika Floripa',
      distance: 'Aprox. 800 m',
      description:
        'Restaurante contemporâneo com ingredientes orgânicos e ambiente descolado.',
    },
    {
      name: 'Ostradamus',
      distance: 'Aprox. 15 km',
      description:
        'Especializado em ostras cultivadas no Ribeirão da Ilha, experiência única.',
    },
  ],
  attractions: [
    {
      name: 'Praia da Joaquina',
      distance: 'Aprox. 18 km',
      description: 'Famosa pelas dunas e pelas ondas para surf.',
    },
    {
      name: 'Lagoa da Conceição',
      distance: 'Aprox. 8 km',
      description:
        'Lagoa cercada por bares, restaurantes e opções de stand-up paddle.',
    },
    {
      name: 'Trilha da Lagoinha do Leste',
      distance: 'Aprox. 25 km',
      description:
        'Trilha com visual deslumbrante até uma das praias mais preservadas da ilha.',
    },
  ],
  essentials: [
    {
      name: 'Farmácia Catarinense',
      distance: 'Aprox. 300 m',
      type: 'pharmacy',
      description: 'Farmácia 24h na Av. Madre Benvenuta.',
    },
    {
      name: 'Supermercado Angeloni',
      distance: 'Aprox. 1 km',
      type: 'supermarket',
      description:
        'Supermercado completo com padaria, açougue e produtos regionais.',
    },
    {
      name: 'UPA Trindade',
      distance: 'Aprox. 1,5 km',
      type: 'hospital',
      description: 'Unidade de Pronto Atendimento 24h.',
    },
  ],
  seasonalTip:
    'Em setembro, as temperaturas ficam entre 15°C e 23°C. A primavera traz dias mais longos e é ótima para trilhas e passeios ao ar livre. Leve um agasalho leve para as noites.',
}

async function main() {
  for (const data of properties) {
    await prisma.property.upsert({
      where: { code: data.code },
      update: data,
      create: data,
    })
  }

  const fln = await prisma.property.findUnique({ where: { code: 'FLN001' } })
  if (fln) {
    await prisma.experienceGuide.upsert({
      where: { propertyId: fln.id },
      update: {
        status: 'COMPLETED',
        content: fln001Guide,
        generatedAt: new Date(),
      },
      create: {
        propertyId: fln.id,
        status: 'COMPLETED',
        content: fln001Guide,
        generatedAt: new Date(),
      },
    })
  }

  console.log('Seed completed: FLN001 (with guide) and GRM001')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
