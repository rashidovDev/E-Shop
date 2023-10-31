const Order = require("../models/Order")
const OrderItem = require("../models/OrderItem")
const { format } = require("date-fns")
const { isValidObjectId } = require("mongoose")

class OrderController {
    async CreateOrder(req, res) {
        try {
            const { orderItems } = req.body
            console.log(orderItems)
            const orderItemsId = Promise.all(orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                    quantity: orderItem.quantity,
                    product: orderItem.product
                })
            console.log(newOrderItem)
                await newOrderItem.save();
                return newOrderItem._id
            }))

            const orderItemsIds = await orderItemsId
            console.log("IDS",orderItemsIds,orderItemsId)

            const totalPrices = await Promise.all(orderItemsIds.map(async orderItemId => {
                const orderItem = await OrderItem.findOne({ _id: orderItemId }).populate("product", "price")
                const productPrice = orderItem.product.price * orderItem.quantity
                return productPrice
            }))

            console.log("Price,",totalPrices)

            const totalPrice = totalPrices.reduce((acc, current) => {
                return acc + current
            }, 0)

            console.log(totalPrice)

            // const dateTime = format(new Date(), 'yyyy/MM/dd HH:mm:ss')
            const order = new Order({
                orderItems: orderItemsIds,
                status: "pending",
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
            const orders = await Order.find().populate({ path: "orderItems" })
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
            const order = await Order.findOne({ _id: req.params.id }).populate("user", "product")
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

    async getAllOrdersbyPagination(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.limit) || 1;
            const search = req.query.search || '';

            const orders = await Order.find().populate("user")
            const totalItems = await Order.countDocuments()
            console.log(totalItems)

            const filteredItems = orders.filter(order => order.user.username.toLowerCase().includes(search.toLowerCase()));
            if (!filteredItems) {
                return orders
            }
            const start = (page - 1) * perPage;
            const end = page * perPage;

            const paginatedItems = filteredItems.slice(start, end);
            res.json({ totalItems, paginatedItems });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Server error" })
        }
    }

    async updateStatusById(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ message: "Invalid id" })
            }
            let orderStatus
            const orderItem = await Order.findOne({ _id: req.params.id })
            if (!orderItem) {
                return res.status(404).json({ message: "Order is not found" })
            } else if (orderItem.status == "shifting") {
                orderStatus = "pending"
            } else if (orderItem.status == "pending") {
                orderStatus = "shifting"
            }

            const order = await Order.findOneAndUpdate({ _id: req.params.id }, {
                status: orderStatus
            },
                { new: true }
            )
            return res.status(200).json({ message: "Succesfully updated", status: order.status })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Can not update" })
        }
    }

    async updateOrderById(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ message: "Invalid id" })
            }
            const { orderItems } = req.body
            const orderOne = await Order.findOne({_id : req.params.id}).populate("orderItems")
           
           const a = orderOne.orderItems.map(orderItem => {
               return orderItem._id
           })
           
           const orderItemsId = Promise.all(orderItems.map(async orderItem => {
            let newOrderItem = {
                    quantity: orderItem.quantity,
                    product : orderItem.product  
                }
            return newOrderItem
            }))

            const orderItemsIds = await orderItemsId
            console.log(orderItemsIds)

             const updateOrders =Promise.all(a.map(async orderItem => {
             const updateOrder = await OrderItem.findOneAndUpdate({_id : orderItem._id},{
                
             })
              return updateOrder
            }))

            // const totalPrices = await Promise.all(orderItemsIds.map(async orderItemId => {
            //     const orderItem = await OrderItem.findOne({ _id: orderItemId }).populate("product", "price")
            //     const productPrice = orderItem.product.price * orderItem.quantity
            //     return productPrice
            // }))

            // console.log("Price,",totalPrices)

            // const totalPrice = totalPrices.reduce((acc, current) => {
            //     return acc + current
            // }, 0)

            // console.log(totalPrice)
            // const order = await Order.findOneAndUpdate({ _id: req.params.id }, {
            //     status: "pending",
            //     totalPrice,
            //     user: req.user.id,
            //     dateOrdered: Date.now()
            // },
            //     { new: true }
            // )
            // if (!order) {
            //     return res.status(401).json({ message: `Can not find such as order : ${order}` })
            // }
            return res.status(400).send({ message: "Succesfully updated" })
        }
        catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Can not update" })
        }
    }

    async deleteOrderById(req, res) {
        try {
            if (!isValidObjectId(req.params.id)) {
                return res.status(400).json({ message: "Invalid id" })
            }
            const order = await Order.findOneAndDelete({ _id: req.params.id })
            if (order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findOneAndRemove({ _id: orderItem })
                })
                return res.status(200).send({ message: "Succesfully deleted", order })
            }
            return res.status(401).json({ message: `Can not find such as order : ${order}` })

        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Can not update" })
        }
    }

    async getTotalSales(req, res) { 
        try {
            const total = await Order.find().select("totalPrice")
            if (!total) {
                res.status(401).json({ message: "Can not get totaSales" })
            }
            const totalSales = total.map((tot) => {
                return tot.totalPrice
            }, 0)
            const totalSale = totalSales.reduce((acc, curr) => {
                return acc + curr
            }, 0)
            return res.status(200).json({ "totalSale": totalSale })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Can not get" })
        }
    }


}

module.exports = new OrderController()