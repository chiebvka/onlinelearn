const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

async function main () {
    try {
        await database.category.createMany({
            data: [
                {name: "Computer Science"},
                {name: "Maths"},
                {name: "Music"},
                {name: "Geography"},
                {name: "Photography"},
                {name: "Accounting"},
                {name: "Engineering"},
                {name: "Marketing"},
                {name: "Business"},
                {name: "Arts"},
                {name: "Finance"},
                {name: "Videography"},
            ]
        })
    } catch (error) {
        console.log("Error seeding the database categories", error)
    } finally {
        await database.$disconnect
    }
}

main()