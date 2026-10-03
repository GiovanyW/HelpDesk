create database helpdesk_db;

use helpdesk_db;

create table chamados (id int auto_increment primary key,
titulo varchar(255) not null,
setor varchar(50) not null,
prioridade varchar(20) not null,
status varchar(30) not null default 'Aberto'
);
