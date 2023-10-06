const Order = require("../models/Order")
const OrderItem = require("../models/OrderItem")
const { format } = require("date-fns")
const {isValidObjectId} = require("mongoose")

class OrderController {
    async CreateOrder(req, res) {
        try {
            const { orderItems, status} = req.body
            const orderItemsId = Promise.all(orderItems.map(async orderItem => {
                let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product
                })
                await newOrderItem.save();

                return newOrderItem._id
            }))

            const orderItemsIds = await orderItemsId
            console.log(orderItemsIds)

            const totalPrices = await Promise.all(orderItemsIds.map(async orderItemId => {
                const orderItem = await OrderItem.findOne({_id : orderItemId}).populate("product", "price")
                const  productPrice = orderItem.product.price * orderItem.quantity
                return productPrice
            }))

            console.log(totalPrices)
             
            const totalPrice = totalPrices.reduce((acc, current) => {
                return acc + current
            }, 0)

            console.log(totalPrice)

            // const dateTime = format(new Date(), 'yyyy/MM/dd HH:mm:ss')
            const order = new Order({
                orderItems: orderItemsIds,
                status,
                totalPrice,
                user: req.user.id,
                dateOrdered: Date.now()
            })
            await order.save()
            return res.status(200).json(order)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not create product" })
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await Order.find().populate("user", "name")
                // .populate({ path: "orderItems", populate: "product" }).sort({ "dateOrdered": -1 })
            if (!orders) {
                return res.status(401).json({ message: "There is no order" })
            }
            res.json(orders)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get product" })
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await Order.findOne({ _id: req.params.id }).populate("user", "name")
                .populate({ path: "orderItems", populate: "product" })
            if (!order) {
                return res.status(401).json({ message: "There is no order" })
            }
            res.json(order)
        } catch (err) {
            console.log(err)
            return res.status(400).json({ message: "Can not get product" })
        }
    }

    async updateOrderById(req, res) {
        try{
            if(!isValidObjectId(req.params.id)){
                return res.status(400).json({ message : "Invalid id"})
            }
              const order = await Order.findOneAndUpdate({_id : req.params.id}, {
                  status : req.body.status
              },
              {new : true}
              )
            if(!order){
               return  res.status(401).json({message : `Can not find such as order : ${order}`})
            }
               return res.status(400).send({message : "Succesfully updated", order})
  
        }catch(err){
            console.log(err)
            return res.status(500).json({ message : "Can not update"})
        }
    }

    async deleteOrderById(req, res) {
        try{
            if(!isValidObjectId(req.params.id)){
                return res.status(400).json({ message : "Invalid id"})
            }
              const order = await Order.findOneAndDelete({_id : req.params.id})
            if(order){
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findOneAndRemove({ _id : orderItem})
                })
                return res.status(200).send({message : "Succesfully deleted", order})
            }
            return  res.status(401).json({message : `Can not find such as order : ${order}`})
  
        }catch(err){
            console.log(err)
            return res.status(500).json({ message : "Can not update"})
        }
    }

    async getTotalSales(req, res){
        try{
            const total = await Order.find().select("totalPrice")
            if(!total){
                res.status(401).json({ message : "Can not get totaSales"})
            }
            const totalSales = total.map((tot) => {
                return tot.totalPrice
            },0) 
            const totalSale = totalSales.reduce((acc, curr) => {
                return acc + curr
            }, 0)
            return res.status(200).json({"totalSale" : totalSale })
        }catch(err){
            console.log(err)
            return res.status(500).json({ message : "Can not get"})
        }
    }

    
}

module.exports = new OrderController()