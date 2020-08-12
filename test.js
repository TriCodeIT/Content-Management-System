const bcrypt = require('bcrypt')

bcrypt.hash('asdf',10)
.then(data => console.log(data))

bcrypt.compare('asdf', '$2b$10$ZjmoX7.mFgnygEPggUU/uub0jFA20iHl.BPN8g3ZR/tfAeoJ5nFRm')
.then(data => console.log(data))