import fs from "node:fs"
import path from "node:path"
import { faker } from "@faker-js/faker"

import { dbPath } from "./utils.js"

const USER_COUNT = 200
const POST_COUNT = 100

const admin = [
  {
    id: 1,
    name: "Admin",
    email: "admin@example.com",
    password: "Qq12345678-",
    address: faker.location.streetAddress(false),
    phone: faker.phone.number(),
    referral: "",
    role: "admin",
    token: "admin-" + faker.string.uuid(),
    subscription: {
      type: "yearly",
      expiryDate: new Date("2049-12-12"),
      isSubscribed: true,
    },
  },
]

const users = Array.from({ length: USER_COUNT }, (_, i) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const subType = faker.helpers.arrayElement(["free", "monthly", "yearly"])

  return {
    id: i + 2,
    name: `${firstName} ${lastName}`,
    email: faker.internet.exampleEmail({ firstName, lastName }).toLowerCase(),
    password: "Qq12345678-",
    address: faker.location.streetAddress(false),
    phone: faker.phone.number(),
    referral: "",
    role: "user",
    token: firstName.toLowerCase() + "-" + faker.string.uuid(),
    subscription: {
      type: subType,
      expiryDate: subType !== "free" ? faker.date.future({ years: 3 }) : null,
      isSubscribed: subType !== "free",
    },
  }
})

const posts = Array.from({ length: POST_COUNT }, (_, i) => {
  const title = faker.lorem.sentence().replace(/\./g, "")

  return {
    id: i + 1,
    title: title,
    content: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () =>
      faker.lorem.sentences({ min: 4, max: 10 }),
    ).join("\n"),
    isPremium: faker.datatype.boolean(),
    category: faker.helpers.arrayElement([
      "uncategorized",
      "lifestyle",
      "food",
      "travel",
      "business",
      "culture",
    ]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent({ days: 90 }),
    likers: faker.helpers.arrayElements(
      users.map((user) => user.id),
      {
        min: 0,
        max: USER_COUNT,
      },
    ),
    shareCount: faker.number.int({ min: 0, max: 1000 }),
    image: faker.image.urlPicsumPhotos({
      height: 1000,
      width: 1600,
    }),
    slug: faker.helpers.slugify(title).toLowerCase(),
  }
})

const data = {
  users: [...admin, ...users],
  posts,
  transactions: [],
}

try {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath))
  }

  console.log("db.json generated")

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
} catch (err) {
  console.error(err.message)
}
