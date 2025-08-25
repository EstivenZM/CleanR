create database cleanr;
use cleanr;

create table users(
id int auto_increment primary key,
name varchar(200),
email varchar(200) unique,
password varchar(200),
rol enum("tutor", "admin", "employee")
);
insert into users(name) values("Sin usuario");

create table ubications(
id int auto_increment primary key,
name varchar(200)
);
insert into ubications(name) values("Sin ubicacion");


create table tasks (
  id int auto_increment primary key,
  task_name varchar(200),
  
  ubication_id int default 1,
  foreign key (ubication_id) references ubications(id)
  on update cascade
  on delete set null
);

create table registers_tasks (
  id int auto_increment primary key,
  date_register timestamp default current_timestamp,
  status enum('complete', 'failed'),
  observation text,
  
  user_id int default 1,
  foreign key(user_id) references users(id)
    on update cascade
    on delete set null,
    
  task_id int,
  foreign key (task_id) references tasks(id)
    on update cascade
    on delete cascade
);


create table alerts(
id int auto_increment primary key,
description_alert text,
date_alert timestamp default current_timestamp,
status enum("failed", "complete"),

user_alerted int default 1,
foreign key (user_alerted) references users(id)
on update cascade
on delete set null,

ubication_id int,
foreign key(ubication_id) references ubications(id)
on update cascade
on delete cascade
);

# Users creations
/*user for rol admin*/
create user 'administrator'@'localhost' identified by 'admin123';
grant select, insert, update, delete on cleanr.* to 'administrator'@'localhost';

/*user for anothers rols*/
create user 'user'@'localhost' identified by 'user321';
grant select, insert, update, delete
on cleanr.alerts to 'user'@'localhost';

grant select, insert, update, delete
on cleanr.registers_tasks to 'user'@'localhost';

flush privileges; # refresh	