export function decodeURIComponent(component: string): string
{
    return component.replace("+", " ");
}

export function encodeURIComponent(component: string): string
{
    return component.replace(" ", "+");
}