const router = require("express").Router();
const Database = require("../db");
const db = new Database();
const Middleware = require("../middleware");

router.get("/", Middleware.isAuthenticated, async (req, res) => {
    const client = await db.getInstance();
    const response = await client.query('SELECT * from "order"');
    Middleware.ok(res, response.rows);
});

router.get("/:id", Middleware.isAuthenticated, async (req, res) => {
    const client = await db.getInstance();
    const response = await client.query('SELECT * from "order" where id = $1', [req.params.id]);
    Middleware.ok(res, response.rows);
}
);

router.post("/", Middleware.isAuthenticated, async (req, res) => {
    const {numeroPedido, valorTotal, dataCriacao, items} = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
        Middleware.error(res, 400, 'Missing parameters');
        return;
    }

    if (!Array.isArray(items)) {
        Middleware.error(res, 400, 'Items must be an array');
        return;
    }

    for(let i = 0; i < items.length; i++) {
        const { idItem, quantidadeItem, valorItem } = items[i];
        if (!idItem || !quantidadeItem || !valorItem) {
            Middleware.error(res, 400, 'Missing parameters in item');
            return;
        }
    }

    const client = await db.getInstance();

    const resCheck = await client.query('SELECT orderid from "order" where orderid = $1', [numeroPedido]);
    if(resCheck.rows.length > 0) {
        Middleware.error(res, 400, 'Order already exists');
        return;
    }

    try {
        await client.query('BEGIN');

        const resInsert = await client.query('INSERT INTO "order" (orderid, value, creationdate) VALUES ($1, $2, $3) RETURNING *', [
            numeroPedido, valorTotal, dataCriacao
        ]);
        let order = resInsert.rows[0] ?? null;
        if(!order) {
            Middleware.error(res, 500, 'Failed to create order');
            return;
        }
    
        order.items = [];
        for(let i = 0; i < items.length; i++) {
            const { idItem, quantidadeItem, valorItem } = items[i];
            const resInsertItem = await client.query('INSERT INTO items (orderid, productid, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *', [
                order.orderid, idItem, quantidadeItem, valorItem
            ]);
            
            let item = resInsertItem.rows[0] ?? null;
            if(!item) {
                Middleware.error(res, 500, 'Failed to create order item');
                return;
            }
    
            order.items.push(item);
        }

        await client.query('COMMIT');
    
        Middleware.ok(res, order);
    } catch (error) {
        await client.query('ROLLBACK');
        Middleware.error(res, 500, 'Failed to create order');
    }
});

module.exports = router;