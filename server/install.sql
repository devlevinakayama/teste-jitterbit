CREATE TABLE IF NOT EXISTS public."order" (
	orderid varchar(20) NOT NULL,
	value float8 DEFAULT 0 NOT NULL,
	creationdate timestamp NOT NULL,
	CONSTRAINT orders_pk PRIMARY KEY (orderid)
);

CREATE TABLE IF NOT EXISTS public.items (
	orderid varchar(20) NOT NULL,
	productid int8 NOT NULL,
	quantity int8 NOT NULL,
	price float8 NOT NULL,
	CONSTRAINT item_pk PRIMARY KEY (orderid, productid)
);