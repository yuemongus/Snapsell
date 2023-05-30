var bcrypt = require('bcrypt');

async function urmom(){
    let password = 'liverpool'
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    console.log( await bcrypt.compare(password,hashedPassword))
}
urmom()