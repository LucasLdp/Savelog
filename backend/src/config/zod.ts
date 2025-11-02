import * as z from "zod";

z.config({
  customError: (iss: any) => {
    if (iss.code === "invalid_type" && iss.expected === "string") {
      return `O campo ${iss.path.join(".")} esperava uma string`;
    }

    if (iss.code === "invalid_type" && iss.expected === "number") {
      return `O campo ${iss.path.join(".")} esperava um número`;
    }

    if (iss.code === "invalid_type" && iss.expected === "boolean") {
      return `O campo ${iss.path.join(".")} esperava um booleano`;
    }

    if (iss.code === "invalid_type" && iss.expected === "array") {
      return `O campo ${iss.path.join(".")} esperava uma lista`;
    }

    if (iss.code === "invalid_type" && iss.expected === "object") {
      return `O campo ${iss.path.join(".")} esperava um objeto`;
    }

    if (iss.code === "invalid_string" && iss.validation === "email") {
      return `E-mail inválido no campo ${iss.path.join(".")}`;
    }

    if (iss.code === "invalid_string" && iss.validation === "url") {
      return `URL inválida no campo ${iss.path.join(".")}`;
    }

    if (iss.code === "invalid_string" && iss.validation === "uuid") {
      return `UUID inválido no campo ${iss.path.join(".")}`;
    }

    if (iss.code === "too_small" && iss.type === "string") {
      return `O campo ${iss.path.join(".")} deve ter no mínimo ${
        iss.minimum
      } caractere${iss.minimum !== 1 ? "s" : ""}`;
    }

    if (iss.code === "too_big" && iss.type === "string") {
      return `O campo ${iss.path.join(".")} deve ter no máximo ${
        iss.maximum
      } caractere${iss.maximum !== 1 ? "s" : ""}`;
    }

    if (iss.code === "too_small" && iss.type === "number") {
      return `O campo ${iss.path.join(".")} deve ser no mínimo ${iss.minimum}`;
    }

    if (iss.code === "too_big" && iss.type === "number") {
      return `O campo ${iss.path.join(".")} deve ser no máximo ${iss.maximum}`;
    }

    if (iss.code === "too_small" && iss.type === "array") {
      return `O campo ${iss.path.join(".")} deve ter no mínimo ${
        iss.minimum
      } item${iss.minimum !== 1 ? "s" : ""}`;
    }

    if (iss.code === "too_big" && iss.type === "array") {
      return `O campo ${iss.path.join(".")} deve ter no máximo ${
        iss.maximum
      } item${iss.maximum !== 1 ? "s" : ""}`;
    }

    if (iss.code === "invalid_enum_value") {
      return `Valor inválido no campo ${iss.path.join(
        "."
      )}. Valores aceitos: ${iss.options.join(", ")}`;
    }

    if (iss.code === "invalid_date") {
      return `Data inválida no campo ${iss.path.join(".")}`;
    }

    if (iss.code === "unrecognized_keys") {
      return `Campos não reconhecidos: ${iss.keys.join(", ")}`;
    }

    return `Erro de validação no campo ${iss.path.join(".")}: ${iss.code}`;
  },
});
