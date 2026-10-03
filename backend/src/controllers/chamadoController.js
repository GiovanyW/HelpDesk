const Chamado = require('../models/chamadoModel');

exports.createChamado = async (req, res) => {
    try {
        const { titulo, setor, prioridade } = req.body;
        const newChamado = await Chamado.create(titulo, setor, prioridade);
        res.status(201).json(newChamado);
    }
    catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.getAllChamados = async (req, res) => {
    try {
        const chamados = await Chamado.findAll();
        res.json(chamados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.getChamadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const chamado = await Chamado.findById(id);
        if (!chamado)
            return res.status(404).json({ erro: "Registro não encontrado" });
        res.json(chamado);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.updateChamado = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, setor, prioridade, status } = req.body;

        const updated = await Chamado.update(id, titulo, setor, prioridade, status);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

exports.deleteChamado = async (req, res) => {
    try {
        const { id } = req.params;
        const sucesso = await Chamado.delete(id);
        if (!sucesso)
            return res.status(404).json({ erro: "Registro não encontrado" });
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}
