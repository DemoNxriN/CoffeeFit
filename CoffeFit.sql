-- 1. CREACIÓ DE LA BASE DE DADES
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'CoffeFit')
BEGIN
    CREATE DATABASE CoffeFit;
END
GO

USE CoffeFit;
GO

-- 2. CREACIÓ DE TAULES (SENSE CLAU)
CREATE TABLE Menu (
    ID_Menu INT IDENTITY(1,1) NOT NULL,
    Nom NVARCHAR(100) NOT NULL,
    Descripcio NVARCHAR(MAX),
    Ingredients_calories NVARCHAR(MAX)
);

CREATE TABLE Productes (
    ID_Productes INT IDENTITY(1,1) NOT NULL,
    Nom NVARCHAR(100) NOT NULL,
    Descripcio NVARCHAR(MAX),
    Cost DECIMAL(10, 2),
    Unitat INT,
    PreuVenta DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Client (
    ID_Client INT IDENTITY(1,1) NOT NULL,
    Nom NVARCHAR(100) NOT NULL,
    Correu NVARCHAR(100) NOT NULL UNIQUE 
);

CREATE TABLE Comentaris (
    ID_Comentaris INT IDENTITY(1,1) NOT NULL,
    ID_Client INT NULL
);

CREATE TABLE Compres (
    ID_Compres INT IDENTITY(1,1) NOT NULL,
    Data DATE NOT NULL,
    Hora TIME NOT NULL,
    NomClient NVARCHAR(100),
    ID_Client INT NOT NULL
);

CREATE TABLE Detall_Compres (
    ID_Compra INT NOT NULL,
    ID_Producte INT NOT NULL,
    Quantitat INT NOT NULL,
    PreuUnitari DECIMAL(10, 2) NOT NULL
);

GO
-- 3. AFEGIR CLAUS PRIMÀRIES (PK)
ALTER TABLE Menu 
    ADD CONSTRAINT PK_Menu PRIMARY KEY CLUSTERED (ID_Menu);

ALTER TABLE Productes 
    ADD CONSTRAINT PK_Productes PRIMARY KEY CLUSTERED (ID_Productes);

ALTER TABLE Client 
    ADD CONSTRAINT PK_Client PRIMARY KEY CLUSTERED (ID_Client);

ALTER TABLE Comentaris 
    ADD CONSTRAINT PK_Comentaris PRIMARY KEY CLUSTERED (ID_Comentaris);

ALTER TABLE Compres 
    ADD CONSTRAINT PK_Compres PRIMARY KEY CLUSTERED (ID_Compres);

-- PKs Composta
ALTER TABLE Detall_Compres 
    ADD CONSTRAINT PK_Detall_Compres PRIMARY KEY CLUSTERED (ID_Compra, ID_Producte);

GO
-- 4. AFEGIR CLAUS ESTRANGERES (FK)

-- Taula: Comentaris
ALTER TABLE Comentaris 
    ADD CONSTRAINT FK_Comentaris_Client FOREIGN KEY (ID_Client) 
    REFERENCES Client(ID_Client) 
    ON DELETE NO ACTION ON UPDATE CASCADE;

-- Taula: Compres
ALTER TABLE Compres 
    ADD CONSTRAINT FK_Compres_Client FOREIGN KEY (ID_Client) 
    REFERENCES Client(ID_Client);

-- Taula: Detall_Compres
ALTER TABLE Detall_Compres 
    ADD CONSTRAINT FK_DetallCompres_Compres FOREIGN KEY (ID_Compra)
    REFERENCES Compres(ID_Compres) 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE Detall_Compres 
    ADD CONSTRAINT FK_DetallCompres_Producte FOREIGN KEY (ID_Producte) 
    REFERENCES Productes(ID_Productes);
GO