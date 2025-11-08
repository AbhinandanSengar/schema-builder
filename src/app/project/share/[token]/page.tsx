import SharedCanvas from "@/app/Components/Canvas/SharedCanvas";


export default async function SharedProjectPage(
    { params }: { params: { token: string } }
) {
    const token = params.token;

    return <SharedCanvas token={token} />;
}
