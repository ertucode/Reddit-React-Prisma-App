
const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
})

export default function formatDate(date: string) {
    return dateFormatter.format(new Date(date))
}