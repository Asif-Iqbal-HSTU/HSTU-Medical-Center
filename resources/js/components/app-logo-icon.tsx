// import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo/hstuLogo.jpg"
            alt="HSTU Logo"
        />
    );
}

