const db = require('../config/db');

class Chamado{
    constructor (id, titulo, setor, prioridade, status){
        this.id = id;
        this.titulo = titulo;
        this.setor = setor;
        this.prioridade = prioridade;
        this.status = status;
    }
}

const chamadoModel = {
    //criar chamado no banco de dados (o status inicial é sempre Aberto)
    create : async (titulo, setor, prioridade) => {
        const [result] = await db.query
        ('INSERT INTO chamados (titulo, setor, prioridade, status) VALUES (?, ?, ?, ?)',
            [titulo, setor, prioridade, 'Aberto']);
        return new Chamado(result.insertId, titulo, setor, prioridade, 'Aberto');
    },

    //Método que lista os chamados cadastrados
    findAll : async()=>{
        const [rows] = await db.query('SELECT * FROM chamados');
        return rows.map(row=> new Chamado(row.id, row.titulo, row.setor, row.prioridade, row.status))
    },

    //Método que busca um chamado pelo id
    findById : async(id)=>{
        const [rows] = await db.query('SELECT * FROM chamados WHERE id=?',[id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return new Chamado(row.id, row.titulo, row.setor, row.prioridade, row.status);
    },

    update : async(id,titulo,setor,prioridade,status) => {
        await db.query('UPDATE chamados set titulo=?, setor=?, prioridade=?, status=? WHERE id=?',
            [titulo,setor,prioridade,status,id]);
        return new Chamado(id,titulo,setor,prioridade,status);
    },

    delete : async(id) => {
        const [result] =
        await db.query('DELETE FROM chamados WHERE id=?',[id]);
        return result.affectedRows > 0;
    }
};

module.exports = chamadoModel;
