CREATE TABLE IF NOT EXISTS public."order" (
	orderid uuid NOT NULL,
	value float8 DEFAULT 0 NOT NULL,
	creationdate timestamp NOT NULL,
	CONSTRAINT orders_pk PRIMARY KEY (orderid)
);

CREATE TABLE IF NOT EXISTS public.items (
	orderid uuid NOT NULL,
	productid int8 NOT NULL,
	quantity int8 NOT NULL,
	price float8 NOT NULL,
	CONSTRAINT items_pk PRIMARY KEY (orderid, productid)
);