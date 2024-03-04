

--Practica de RPC -- Sistema de Tareas

drop table tareas

CREATE TABLE tareas (
    id_tareas int generated always as identity,
    titulo VARCHAR(100) not null,
    descripcion VARCHAR(100) not null,
    encargado VARCHAR(100) not null,
    completada BOOLEAN DEFAULT FALSE,
    Primary Key(id_tareas)
);


SELECT * FROM tareas


--delete from tareas 
insert into tareas (titulo,descripcion,encargado) values ('Prueba 1','Prueba 1 descripcion','Jose')








