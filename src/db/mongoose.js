const mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_db_url,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:true
})


