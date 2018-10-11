
const Post = require("../models/Post");
const Photo = require("../models/Photo");
const User = require("../models/User");

const randLats = [-18.01209, -18.4033, -18.12537829];
const randLngs = [-70.35323, -70.5023, -70.25344];
const faker = require("faker");
const mongoose = require("mongoose");

const config = require("../deploy");


async function dropDB() {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI);
        mongoose.connection.on("open", function(){
            mongoose.connection.db.dropDatabase(resolve);
        });
    })
   
}

async function createRandomUser() {
    const user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        description: faker.lorem.paragraph(),
        email: faker.internet.email(),
        password: "123456"
    }
    
    const userInstance = await User.create(user);
    return userInstance;
}

async function createRandomPosts(user) {
    for (let j = 0; j < 10; j++) {

        const post = {
            description: faker.lorem.paragraph(),
            address: faker.address.streetAddress(),
            type: Math.round(Math.random() * 1),
            user: user.id,
            type: Math.round(Math.random()),
            cellphone: faker.phone.phoneNumber(),
            photos: []
        };

        if (post.type === 0) {
            post.latitude = -18.01209;
            post.longitude = -70.35323; 
        } else {
            post.latitude = -18.4033;
            post.longitude = -70.5023; 
        }

        const postInstance = await Post.create(post);
        const photos = [];
        for (let k = 0; k < 2; k++) {
            const photo = {
                name: faker.lorem.word(),
                path: faker.image.animals(),
                thumbnailPath: "http://www.fullfondos.com/animales/perrito_blanco/perrito_blanco.jpg",
                postId: postInstance.id
            }
            const photoInstance = await Photo.create(photo);
            photos.push(photoInstance.id);
        }
        postInstance.photos = photos;
        await postInstance.save();
    }
}

async function adminSeed() {
    const commonParams = {
        password: "helpet123"
    }
    const admins = [
        {
            firstName: "Angel",
            lastName: "Rodriguez",
            email: "angel.rodriguez@helpet.org",
            ...commonParams
        },
        {
            firstName: "Rodrigo",
            lastName: "Viveros",
            email: "rodrigo.viveros@helpet.org",
            ...commonParams
        },
        {
            firstName: "Cristian",
            lastName: "Peralta",
            email: "cristian.peralta@helpet.org",
            ...commonParams
        },
        {
            firstName: "Jose",
            lastName: "Thea",
            email: "jose.thea@helpet.org",
            ...commonParams
        },
        {
            firstName: "Gladys",
            lastName: "Mamani",
            email: "gladys.mamani@helpet.org",
            ...commonParams
        }
    ];

    for (const admin of admins) {
        await User.create(admin);
    }
}

async function startSeed() {
    for (let i = 0; i < 5; i++) {
        const user = await createRandomUser();
        await createRandomPosts(user);
    }
}

async function connect() {

    return new Promise((resolve, reject) => {
        mongoose.connect(config.dbURI, resolve);
    })
    
}

async function init() {

    try {
        await dropDB();
        await connect();
        await adminSeed();
        await startSeed();
        console.log("Seed completed! You can check your new data in the app :)")
    } catch (error) {
        console.error(error)
    }
    process.exit();
}

init();




