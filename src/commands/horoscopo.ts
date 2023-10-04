import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import {Client} from "discord.js";
import axios from "axios";


// noinspection JSUnusedGlobalSymbols
export const data = new SlashCommandBuilder()
    .setName("horoscope")
    .setDescription("shows your future using the stars")
    .addStringOption(option => option.setName("sign")
        .setDescription("your sign").setRequired(true)
        .addChoices({name: "aries", value: "aries"},
            {name: "tauro", value: "tauro"},
            {name: "geminis", value: "geminis"},
            {name: "cancer", value: "cancer"},
            {name: "leo", value: "leo"},
            {name: "virgo", value: "virgo"},
            {name: "libra", value: "libra"},
            {name: "escorpion", value: "escorpion"},
            {name: "sagitario", value: "sagitario"},
            {name: "capricornio", value: "capricornio"},
            {name: "acuario", value: "acuario"},
            {name: "picis", value: "picis"}))


export function execute(interaction: CommandInteraction, client: Client) {

    if (interaction.user.id === "401845716991082496") {//romandev. https://discord.com/channels/768278151435386900/1055594415286140979/1154141982948610149
        interaction.reply("Deja de romper las pelotas, un signo no determina tu personalidad");
        return
    }

    let option = interaction.options.get('sign')

    let sign = option?.value?.toString().toLowerCase();

    let map = new Map<string, number>();
    let emojiMap = new Map<string, string>();

    /**
     *  ARIES(1, "♈️"), TAURO(2, "♉️"), GEMINIS(3, "♊️"), CANCER(4, "♋️"), LEO(5, "♌️"), VIRGO(6, "♍️"), LIBRA(7, "♎️"),
     *         ESCORPION(8, "♏️"), SAGITARIO(9, "♐️"), CAPRICORNIO(10, "♑️"), ACUARIO(11, "♒️"), PICIS(12, "♓️"), NONE(0, "🙈");
     */
    map.set("aries", 1);
    map.set("tauro", 2);
    map.set("geminis", 3);
    map.set("cancer", 4);
    map.set("leo", 5);
    map.set("virgo", 6);
    map.set("libra", 7);
    map.set("escorpion", 8);
    map.set("sagitario", 9);
    map.set("capricornio", 10);
    map.set("acuario", 11);
    map.set("picis", 12);

    emojiMap.set("aries", "♈️");
    emojiMap.set("tauro", "♉️");
    emojiMap.set("geminis", "♊️");
    emojiMap.set("cancer", "♋️");
    emojiMap.set("leo", "♌️");
    emojiMap.set("virgo", "♍️");
    emojiMap.set("libra", "♎️");
    emojiMap.set("escorpion", "♏️");
    emojiMap.set("sagitario", "♐️");
    emojiMap.set("capricornio", "♑️");
    emojiMap.set("acuario", "♒️");
    emojiMap.set("picis", "♓️");

    if (sign == null) {//should never happen
        interaction.reply("Los astros no me dijeron tu signo");
        return
    }

    let signId = map.get(sign);

    if (signId === undefined) {//should never happen
        interaction.reply("Difícil que te entienda, no sé qué signo es ese");
        return
    }

    try {
        axios.get('https://www.misabueso.com/esoterica/horoscopo/?zod=' + signId)
            .then(response => {
                return extract(response.data)
            }).then(result => {
            interaction.reply(emojiMap.get(sign!.toLowerCase()) + " " + sign?.toUpperCase() + " " + result)
        }).catch(() => {
            interaction.reply("No sé qué pasó, pero probablemente es culpa de los astros")
        });


    } catch (error) {
        // Handle any errors that occurred during the request
        interaction.reply("No sé qué pasó, pero no pude leer tu futuro")
    }

}

function extract(x: string): string {
    if (x.length === 0) {
        return "";
    }

    const i: number = x.indexOf("Horóscopo para hoy");
    const f: number = x.indexOf("Compatibilidad de");

    if (i === -1 || f === -1) {
        return "";
    }

    const pre: string = x.substring(i, f);

    return pre.substring(pre.indexOf("p>") + 2, pre.lastIndexOf("<!"));
}