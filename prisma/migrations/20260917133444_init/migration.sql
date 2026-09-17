-- CreateEnum
CREATE TYPE "GuideStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedroomQuantity" INTEGER NOT NULL,
    "bathroomQuantity" INTEGER NOT NULL,
    "guestCapacity" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "wifiNetwork" TEXT NOT NULL,
    "wifiPassword" TEXT NOT NULL,
    "isSelfCheckin" BOOLEAN NOT NULL,
    "accessType" TEXT NOT NULL,
    "accessInstructions" TEXT NOT NULL,
    "accessPassword" TEXT NOT NULL,
    "hasParking" BOOLEAN NOT NULL,
    "parkingIdentifier" TEXT,
    "parkingInstructions" TEXT,
    "checkInTime" TEXT NOT NULL,
    "checkOutTime" TEXT NOT NULL,
    "allowPet" BOOLEAN NOT NULL,
    "smokingPermitted" BOOLEAN NOT NULL,
    "suitableForChildren" BOOLEAN NOT NULL,
    "suitableForBabies" BOOLEAN NOT NULL,
    "eventsPermitted" BOOLEAN NOT NULL,
    "amenities" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "hostName" TEXT NOT NULL,
    "hostPhone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceGuide" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "status" "GuideStatus" NOT NULL DEFAULT 'PENDING',
    "content" JSONB,
    "errorMessage" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceGuide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceGuide_propertyId_key" ON "ExperienceGuide"("propertyId");

-- AddForeignKey
ALTER TABLE "ExperienceGuide" ADD CONSTRAINT "ExperienceGuide_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
