const uuid = require('uuid');
const path = require('path');
const {Item,Item_info} = require('../models/models');
const ApiError = require('../error/ApiError');

class ItemController{
    async create(req,res,next){
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + '.jpg'
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))

            if(info){
               info = JSON.parse(info)
               info.forEach(i=>
               Item_info.create({
                   tittle: i.tittle,
                   description: i.description,
                   itemID: item.id
               }))
            }

            const item = await Item.create({name, price, brandId, typeId, img: fileName});

            return res.json(item)
        } catch(e){
            next(ApiError.badRequest())
        }
    }
    async getAll(req,res){
        let {brandId, typeId, limit, page} = req.query
        page = page ||1
        limit = limit || 9
        let offset = page * limit - limit
        let items;
        if (!brandId && !typeId) {
            items = await Item.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            items = await Item.findAndCountAll({where: {brandId},limit,offset})
        }
        if (!brandId && typeId) {
            items = await Item.findAndCountAll({where: {typeId},limit,offset})
        }
        if (brandId && typeId) {
            items = await Item.findAndCountAll({where: {brandId,typeId},limit,offset})

        }
        return res.json(items)
    }
    async getOne(req,res){
        const{id}=req.params
        const item = await Item.findOne(
            {
                where:{id},
                include:[{model:Item_info,as:'info'}],
            },
        )
        return res.json(item)
    }

}

module.exports = new ItemController()