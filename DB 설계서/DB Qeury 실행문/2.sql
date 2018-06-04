/* 이하, 테이블 생성 쿼리문*/

CREATE TABLE T_USER (
	user_id INT(11) NOT NULL auto_increment,
    passwd VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    tel VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    grade VARCHAR(100) NOT NULL,
    primary key(user_id)
)
COLLATE = 'utf8_general_ci';
    
    
CREATE TABLE T_ITEM(
	item_id INT(11) NOT NULL auto_increment, 
	user_id INT(11),
    product_name VARCHAR(100) NOT NULL,
    product_price INT(11) NOT NULL,
    category VARCHAR(100),
    discount_rate INT(11),
    image1 VARCHAR(100),
    image2 VARCHAR(100),
    image3 VARCHAR(100),
    description TEXT,
    avg_star int(11),
    
    primary key(item_id),
    foreign key(user_id) references T_USER(user_id)
)COLLATE = 'utf8_general_ci';    
    
CREATE TABLE T_CART(
	cart_id INT(11) NOT NULL auto_increment,
    user_id INT(11) NOT NULL,
    item_id INT(11) NOT NULL,
    item_quantity INT(11) NOT NULL,
	total_price INT(11) NOT NULL,
    primary key(cart_id),
    foreign key(user_id) references T_USER(user_id),
    foreign key(item_id) references T_ITEM(item_id)
);

CREATE TABLE T_ORDER(
	order_id INT(11) NOT NULL auto_increment,
    user_id INT(11) NOT NULL,
	order_date DATETIME NOT NULL,
    address VARCHAR(100) NOT NULL,
    total_price INT(11),
    
    PRIMARY KEY(order_id),
    foreign key(user_id) references T_USER(user_id)
)COLLATE = 'utf8_general_ci';

CREATE TABLE T_ORDERDETAIL(
	odd_id INT(11) NOT NULL auto_increment,
    item_id INT(11) NOT NULL,
    order_id INT(11) NOT NULL,
	item_quantity INT(11) NOT NULL,
    
    primary key(odd_id),
    foreign key(item_id) references T_ITEM(item_id),
    foreign key(order_id) references T_ORDER(order_id)
);


CREATE TABLE T_BOARD(
	board_id INT(11) NOT NULL auto_increment,
    item_id INT(11),
    title VARCHAR(100),
    
    primary key(board_id),
    foreign key(item_id) references T_ITEM(item_id)
)COLLATE = 'utf8_general_ci';


CREATE TABLE T_REVIEW(
	email VARCHAR(100) NOT NULL,
	item_id INT(11) NOT NULL,
    title VARCHAR(100) NOT NULL,
    contents text,
    score INT(11),
    
    foreign key(item_id) references T_ITEM(item_id)
)COLLATE = 'utf8_general_ci';