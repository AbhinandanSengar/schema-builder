import SharedCanvas from "@/app/Components/Canvas/SharedCanvas";


export default async function SharedProjectPage(
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;

    return <SharedCanvas token={token} />;
}
