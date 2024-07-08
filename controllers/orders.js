const router = require("express").Router();
const Database = require("../db");
const db = new Database();
const Middleware = require("../middleware");

router.get("/", Middleware.isAuthenticated, async (req, res) => {
    const client = await db.getInstance();
    const response = await client.query('SELECT * from "order"');

    let list = [];
    let orders = response.rows ?? [];
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const responseItems = await client.query('SELECT * from items where orderid = $1', [order.orderid]);
        order.items = responseItems.rows ?? [];

        let items = [];
        for (let j = 0; j < order.items.length; j++) {
            const item = order.items[j];
            items.push({
                idItem: item.productid,
                quantidadeItem: item.quantity,
                valorItem: item.price
            });
        }

        list.push({
            numeroPedido: order.orderid,
            valorTotal: order.value,
            dataCriacao: order.creationdate,
            items: items
        });
    }

    Middleware.ok(res, list);
});

router.get("/:id", Middleware.isAuthenticated, async (req, res) => {
    const client = await db.getInstance();
    const response = await client.query('SELECT * from "order" where orderid = $1', [req.params.id]);

    if (response.rows.length === 0) {
        Middleware.error(res, 404, 'Order not found');
        return;
    }

    const order = response.rows[0];
    const responseItems = await client.query('SELECT * from items where orderid = $1', [order.orderid]);
    order.items = responseItems.rows ?? [];

    let items = [];
    for (let j = 0; j < order.items.length; j++) {
        const item = order.items[j];
        items.push({
            idItem: item.productid,
            quantidadeItem: item.quantity,
            valorItem: item.price
        });
    }

    Middleware.ok(res, {
        numeroPedido: order.orderid,
        valorTotal: order.value,
        dataCriacao: order.creationdate,
        items: items
    });
});

router.post("/", Middleware.isAuthenticated, async (req, res) => {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
        Middleware.error(res, 400, 'Missing parameters');
        return;
    }

    if (!Array.isArray(items)) {
        Middleware.error(res, 400, 'Items must be an array');
        return;
    }

    for (let i = 0; i < items.length; i++) {
        const { idItem, quantidadeItem, valorItem } = items[i];
        if (!idItem || !quantidadeItem || !valorItem) {
            Middleware.error(res, 400, 'Missing parameters in item');
            return;
        }
    }

    const client = await db.getInstance();

    const resCheck = await client.query('SELECT orderid from "order" where orderid = $1', [numeroPedido]);
    if (resCheck.rows.length > 0) {
        Middleware.error(res, 400, 'Order already exists');
        return;
    }

    try {
        await client.query('BEGIN');

        const resInsert = await client.query('INSERT INTO "order" (orderid, value, creationdate) VALUES ($1, $2, $3) RETURNING *', [
            numeroPedido, valorTotal, dataCriacao
        ]);
        let order = resInsert.rows[0] ?? null;
        if (!order) {
            Middleware.error(res, 500, 'Failed to create order');
            return;
        }

        order.items = [];
        for (let i = 0; i < items.length; i++) {
            const { idItem, quantidadeItem, valorItem } = items[i];
            const resInsertItem = await client.query('INSERT INTO items (orderid, productid, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *', [
                order.orderid, idItem, quantidadeItem, valorItem
            ]);

            let item = resInsertItem.rows[0] ?? null;
            if (!item) {
                Middleware.error(res, 500, 'Failed to create order item');
                return;
            }

            order.items.push(item);
        }

        await client.query('COMMIT');

        let returnItems = [];
        for (let i = 0; i < order.items.length; i++) {
            const { productid, quantity, price } = order.items[i];
            returnItems.push({
                idItem: productid,
                quantidadeItem: quantity,
                valorItem: price
            });
        }

        Middleware.ok(res, {
            numeroPedido: order.orderid,
            valorTotal: order.value,
            dataCriacao: order.creationdate,
            items: returnItems
        });
    } catch (error) {
        await client.query('ROLLBACK');
        Middleware.error(res, 500, 'Failed to create order');
    }
});

router.put("/:id", Middleware.isAuthenticated, async (req, res) => {
    const numeroPedido = req.params.id;
    const { valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
        Middleware.error(res, 400, 'Missing parameters');
        return;
    }

    if (!Array.isArray(items)) {
        Middleware.error(res, 400, 'Items must be an array');
        return;
    }

    for (let i = 0; i < items.length; i++) {
        const { idItem, quantidadeItem, valorItem } = items[i];
        if (!idItem || !quantidadeItem || !valorItem) {
            Middleware.error(res, 400, 'Missing parameters in item');
            return;
        }
    }

    const client = await db.getInstance();

    const resCheck = await client.query('SELECT orderid from "order" where orderid = $1', [numeroPedido]);
    if (resCheck.rows.length === 0) {
        Middleware.error(res, 404, 'Order not found');
        return;
    }

    try {
        await client.query('BEGIN');

        const resUpdate = await client.query('UPDATE "order" SET value = $1, creationdate = $2 WHERE orderid = $3 RETURNING *', [
            valorTotal, dataCriacao, numeroPedido
        ]);
        let order = resUpdate.rows[0] ?? null;
        if (!order) {
            Middleware.error(res, 500, 'Failed to update order');
            return;
        }

        await client.query('DELETE FROM items WHERE orderid = $1', [numeroPedido]);

        order.items = [];
        for (let i = 0; i < items.length; i++) {
            const { idItem, quantidadeItem, valorItem } = items[i];
            const resInsertItem = await client.query('INSERT INTO items (orderid, productid, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *', [
                order.orderid, idItem, quantidadeItem, valorItem
            ]);

            let item = resInsertItem.rows[0] ?? null;
            if (!item) {
                Middleware.error(res, 500, 'Failed to create order item');
                return;
            }

            order.items.push(item);
        }

        await client.query('COMMIT');

        let returnItems = [];
        for (let i = 0; i < order.items.length; i++) {
            const { productid, quantity, price } = order.items[i];
            returnItems.push({
                idItem: productid,
                quantidadeItem: quantity,
                valorItem: price
            });
        }

        Middleware.ok(res, {
            numeroPedido: order.orderid,
            valorTotal: order.value,
            dataCriacao: order.creationdate,
            items: returnItems
        });
    } catch (error) {
        await client.query('ROLLBACK');
        Middleware.error(res, 500, 'Failed to update order');
    }

});

router.delete("/:id", Middleware.isAuthenticated, async (req, res) => {
    const numeroPedido = req.params.id;

    if (!numeroPedido) {
        Middleware.error(res, 400, 'Missing parameters');
        return;
    }

    const client = await db.getInstance();

    const resCheck = await client.query('SELECT orderid from "order" where orderid = $1', [numeroPedido]);
    if (resCheck.rows.length === 0) {
        Middleware.error(res, 404, 'Order not found');
        return;
    }

    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM items WHERE orderid = $1', [numeroPedido]);
        await client.query('DELETE FROM "order" WHERE orderid = $1', [numeroPedido]);

        await client.query('COMMIT');

        Middleware.ok(res);
    } catch (error) {
        await client.query('ROLLBACK');
        Middleware.error(res, 500, 'Failed to delete order');
    }
});

module.exports = router;