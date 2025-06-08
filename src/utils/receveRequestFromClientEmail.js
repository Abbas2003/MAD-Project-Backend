export const receveClientRequestEmailTemaple = (name, title, email, img, phone, description) => {
    return `
 <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <title>New Request</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: #f4f4f4;
        }

        .container-box {
            background: white;
            max-width: 600px;
            margin: 40px auto;
            border-radius: 16px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .top-bar {
            background: linear-gradient(90deg, #d6b55a, #bb9845);
            height: 150px;
        }

        .main-content {
            text-align: center;
            padding: 0 16px 24px 16px;
        }

        .main-content h2 {
            font-weight: 700;
            font-size: 32px;
            margin: 0 0 20px 0;
        }

        .denied {
            color: red;
        }

        .agent-card {
            background: #f4f4f4;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            gap: 12px;
            text-align: left;
            margin: 30px 16px;
        }

        .agent-name {
            font-weight: 600;
            margin: 0 0 4px 0;
        }

        .start-chat-btn {
            background-color: #facc15;
            border: none;
            color: #000;
            padding: 10px 24px;
            border-radius: 999px;
            font-weight: 600;
            margin-top: 10px;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
        }

        .footer-text {
            font-size: 18px;
            color: #444;
            margin: 20px 16px 0 16px;
        }

        .support-email {
            color: #c084fc;
            text-decoration: none;
        }

        .bottom-bar {
            background-color: #bf9e46;
            padding: 16px 20px;
            font-size: 12px;
            text-align: center;
            color: #fff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 600px;
            margin: 0 auto;
            box-sizing: border-box;
        }

        .bottom-bar a {
            color: #000;
            text-decoration: none;
            font-weight: 700;
        }

        .social-icons {
            display: flex;
            gap: 8px;
        }

        .social-icon-svg {
            width: 28px;
            height: 28px;
            cursor: pointer;
        }

        .bottom-help {
            text-align: center;
            margin: 20px 0 30px 0;
            font-weight: 600;
            font-size: 16px;
        }

        .bottom-help span {
            color: #d6b55a;
            display: block;
            margin-top: 6px;
        }

        img.rounded-pill {
            border-radius: 9999px;
        }
    </style>
</head>

<body>
    <div class="container-box" style="font-family: Arial, sans-serif;">
        <div style="padding: 16px 0 0 0; text-align: center;">
            <img src="https://realmatch.no/_next/static/media/Gullmeglerlogo.acf25039.png" width="150" alt="" />
        </div>

        <div class="main-content">
            <h2>
                ${ title }
            </h2>

            <div class="agent-card">
                <div>
                    <img src="${ img || 'https://realmatch.no/_next/static/media/img_placeholder.033b4167.jpg' }" alt="" width="50" height="50"
                        class="rounded-pill" />
                </div>
                <div style="margin-left: 10px">
                    <p class="agent-name">${ name }</p>
                    <p style="margin: 0;">${ email }</p>
                    <p style="margin: 5px 0 8px 0;">${ phone || '' }</p>
                    <p style="margin: 0 0 8px 0; color: rgb(94, 94, 94);">${ description || '' }</p>
                    <a href="mailto:${email}" class="start-chat-btn">Start Chat</a>
                </div>
            </div>

            <p class="footer-text">
                We've attached the client information for your reference. Please use it to connect with the client
                directly. If you have any questions or require further assistance, feel free to
                <a href="mailto:support@example.com" class="support-email">contact our support team</a>.
            </p>
        </div>

        <div class="bottom-bar">
            <p style="margin:0; font-size: 14px;">
                © 2025 <a href="#" style="color:#000; font-weight: 700;">Softec Softwares</a>. All rights reserved.
            </p>
            <div class="social-icons">
                <!-- Icons inline SVG with class for styling -->
                <svg class="social-icon-svg" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="35" height="35" rx="17.5" fill="white" />
                    <path
                        d="M14.64 10H21.36C23.92 10 26 12.08 26 14.64V21.36C26 22.5906 25.5111 23.7708 24.641 24.641C23.7708 25.5111 22.5906 26 21.36 26H14.64C12.08 26 10 23.92 10 21.36V14.64C10 13.4094 10.4889 12.2292 11.359 11.359C12.2292 10.4889 13.4094 10 14.64 10ZM14.48 11.6C13.7162 11.6 12.9836 11.9034 12.4435 12.4435C11.9034 12.9836 11.6 13.7162 11.6 14.48V21.52C11.6 23.112 12.888 24.4 14.48 24.4H21.52C22.2838 24.4 23.0164 24.0966 23.5565 23.5565C24.0966 23.0164 24.4 22.2838 24.4 21.52V14.48C24.4 12.888 23.112 11.6 21.52 11.6H14.48ZM22.2 12.8C22.4652 12.8 22.7196 12.9054 22.9071 13.0929C23.0946 13.2804 23.2 13.5348 23.2 13.8C23.2 14.0652 23.0946 14.3196 22.9071 14.5071C22.7196 14.6946 22.4652 14.8 22.2 14.8C21.9348 14.8 21.6804 14.6946 21.4929 14.5071C21.3054 14.3196 21.2 14.0652 21.2 13.8C21.2 13.5348 21.3054 13.2804 21.4929 13.0929C21.6804 12.9054 21.9348 12.8 22.2 12.8ZM18 14C19.0609 14 20.0783 14.4214 20.8284 15.1716C21.5786 15.9217 22 16.9391 22 18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22C16.9391 22 15.9217 21.5786 15.1716 20.8284C14.4214 20.0783 14 19.0609 14 18C14 16.9391 14.4214 15.9217 15.1716 15.1716C15.9217 14.4214 16.9391 14 18 14ZM18 15.6C17.3635 15.6 16.753 15.8529 16.3029 16.3029C15.8529 16.753 15.6 17.3635 15.6 18C15.6 18.6365 15.8529 19.247 16.3029 19.6971C16.753 20.1471 17.3635 20.4 18 20.4C18.6365 20.4 19.247 20.1471 19.6971 19.6971C20.1471 19.247 20.4 18.6365 20.4 18C20.4 17.3635 20.1471 16.753 19.6971 16.3029C19.247 15.8529 18.6365 15.6 18 15.6Z"
                        fill="#BF9E46" />
                </svg>

                <a href="#">
                    <svg class="social-icon-svg" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="35" height="35" rx="17.5" fill="white" />
                        <path
                            d="M19.094 16.928L24.157 11H22.957L18.562 16.147L15.05 11H11L16.31 18.784L11 25H12.2L16.842 19.564L20.304 25H24L19.094 16.928Z"
                            fill="#BF9E46" />
                    </svg>
                </a>
            </div>
        </div>
    </div>

    <div class="bottom-help">
        Need help? <span>Contact us: <a href="mailto:support@example.com"
                style="color:#d6b55a; text-decoration:none;">support@example.com</a></span>
    </div>
</body>

</html>
    `
}