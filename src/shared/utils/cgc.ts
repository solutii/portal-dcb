export const cgcUtils = {

    maskaraCnpj: (v: string): string => {
        v = v.replace(/\D/g, "")
        v= v.replace(/(\d{14})(\d)/, "$1") //remove numeros que passarem da qunatidade de caracteres do cpf
        v = v.replace(/(\d{2})(\d)/, "$1.$2")       //Coloca um ponto entre o segundo e o terceiro dígito
        v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o quinto e o sexto dígito
        v = v.replace(/(\d{3})(\d)/, "$1\/$2")       //Coloca uma barra entre o oitavo e o nono dígito
        //de novo (para o segundo bloco de números)
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        return v
    },

    maskaraCpfCnpj: (v: string) => {

        v = v.replace(/\D/g, "")

        v = v.length > 11 ?
            cgcUtils.maskaraCnpj(v) : cgcUtils.maskaraCpf(v)

        return v

    },

    maskaraCpf: (v: string): string => {
        v = v.replace(/(\d{11})(\d)/, "$1") //remove numeros que passarem da qunatidade de caracteres do cpf
        v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
        v = v.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
        return v
    },
    
}