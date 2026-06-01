from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path

pasta = Path(__file__).resolve().parent.parent

app = Flask(__name__, static_folder=str(pasta), static_url_path="")


def cors(resposta):
    resposta.headers["Access-Control-Allow-Origin"] = "*"
    resposta.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    resposta.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return resposta


@app.after_request
def depois(resposta):
    return cors(resposta)


@app.route("/")
def inicio():
    return send_from_directory(pasta, "index.html")


@app.route("/contacto/", methods=["POST", "OPTIONS"])
def contacto():
    if request.method == "OPTIONS":
        return jsonify({"ok": True})

    dados = request.form

    nome = dados.get("nome", "").strip()
    email = dados.get("email", "").strip()
    mensagem = dados.get("mensagem", "").strip()

    return jsonify({
        "sucesso": True,
        "mensagem": "Obrigado, " + nome + ". A sua mensagem foi recebida."
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
