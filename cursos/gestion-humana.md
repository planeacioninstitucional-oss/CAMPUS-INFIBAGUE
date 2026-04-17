<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión Humana - Campus Virtual Infibagué</title>
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/induccion.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">

    <style>
        /* Estilos Base Gestión Humana */
        body {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);
            background-attachment: fixed;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
            position: relative;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.06) 0%, transparent 50%);
            animation: bgFloat 20s ease-in-out infinite;
            pointer-events: none;
            z-index: 0;
        }

        @keyframes bgFloat {

            0%,
            100% {
                transform: translate(0, 0) scale(1);
            }

            50% {
                transform: translate(20px, -20px) scale(1.05);
            }
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 1;
        }

        .module-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px) saturate(180%);
            border-radius: 20px;
            box-shadow:
                0 8px 32px rgba(37, 99, 235, 0.1),
                0 2px 8px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            margin-bottom: 20px;
            z-index: 10;
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
        }

        .module-header:hover {
            box-shadow:
                0 12px 40px rgba(37, 99, 235, 0.15),
                0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .progress-indicator {
            display: flex;
            gap: 8px;
            padding: 5px;
        }

        .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            position: relative;
        }

        .dot.active {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            transform: scale(1.4);
            box-shadow:
                0 4px 12px rgba(59, 130, 246, 0.4),
                0 0 20px rgba(59, 130, 246, 0.2);
        }

        .dot.active::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: inherit;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {

            0%,
            100% {
                transform: scale(1);
                opacity: 1;
            }

            50% {
                transform: scale(1.5);
                opacity: 0;
            }
        }

        .slide {
            display: none;
            flex: 1;
            flex-direction: column;
            animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            padding-right: 10px;
        }

        .slide.active {
            display: flex;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.98);
            }

            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .slide-title {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 15px;
            text-align: center;
            font-weight: 800;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 10px rgba(37, 99, 235, 0.1);
            position: relative;
            padding-bottom: 10px;
        }

        .slide-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, transparent, #3b82f6, transparent);
            border-radius: 2px;
        }

        .slide-description {
            text-align: center;
            color: #64748b;
            max-width: 700px;
            margin: 0 auto 30px auto;
            font-size: 1.1rem;
            line-height: 1.6;
            font-weight: 500;
        }

        .lesson-card {
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow:
                0 10px 30px rgba(0, 0, 0, 0.08),
                0 4px 12px rgba(0, 0, 0, 0.04);
            border-left: 5px solid #3b82f6;
            transition: transform 0.3s ease;
        }

        .lesson-card:hover {
            transform: translateY(-5px);
            box-shadow:
                0 15px 40px rgba(37, 99, 235, 0.12),
                0 6px 16px rgba(0, 0, 0, 0.08);
        }

        .lesson-card h2 {
            color: #1e40af;
            font-size: 2em;
            margin-bottom: 20px;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 10px;
        }

        .lesson-card h3 {
            color: #2563eb;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        .lesson-card p {
            font-size: 1.1em;
            line-height: 1.8;
            color: #333;
            margin-bottom: 15px;
        }

        .info-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 20px;
            border-radius: 15px;
            margin: 15px 0;
            border-left: 5px solid #3b82f6;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }

        .info-box p {
            margin-bottom: 10px;
        }

        .values-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .value-card {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 25px;
            border-radius: 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            border: 2px solid #bfdbfe;
            position: relative;
            overflow: hidden;
        }

        .value-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            transform: translateY(100%);
            transition: transform 0.4s ease;
            z-index: 0;
        }

        .value-card>* {
            position: relative;
            z-index: 1;
        }

        .value-card:hover::before {
            transform: translateY(0);
        }

        .value-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow:
                0 12px 28px rgba(59, 130, 246, 0.2),
                0 6px 12px rgba(0, 0, 0, 0.1);
            border-color: #3b82f6;
        }

        .value-card:hover h3,
        .value-card:hover p {
            color: white;
        }

        .value-card .icon {
            font-size: 3em;
            margin-bottom: 10px;
            transition: all 0.3s ease;
            filter: drop-shadow(0 2px 4px rgba(37, 99, 235, 0.2));
        }

        .value-card:hover .icon {
            transform: scale(1.15) rotate(5deg);
            filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.3));
        }

        .value-card h3 {
            font-size: 1.4em;
            color: #1e40af;
            margin-bottom: 10px;
            font-weight: bold;
            transition: color 0.3s ease;
        }

        .value-card p {
            font-size: 1em;
            color: #475569;
            transition: color 0.3s ease;
        }

        .directions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 18px;
            margin-top: 20px;
        }

        .direction-card {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            padding: 24px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #3b82f6;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
        }

        .direction-card:hover {
            transform: translateY(-6px);
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            box-shadow:
                0 10px 24px rgba(37, 99, 235, 0.2),
                0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .direction-card .icon {
            font-size: 2.8em;
            margin-bottom: 12px;
            transition: all 0.3s ease;
        }

        .direction-card:hover .icon {
            transform: scale(1.15);
        }

        .direction-card strong {
            display: block;
            margin-bottom: 8px;
            font-size: 1.1em;
        }

        .nav-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 25px;
            gap: 15px;
        }

        .btn-nav {
            padding: 14px 30px;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow:
                0 4px 12px rgba(0, 0, 0, 0.1),
                0 2px 4px rgba(0, 0, 0, 0.06);
            position: relative;
            overflow: hidden;
        }

        .btn-nav::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }

        .btn-nav:hover::before {
            width: 300px;
            height: 300px;
        }

        .btn-prev {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            color: #475569;
        }

        .btn-next {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            box-shadow:
                0 6px 16px rgba(59, 130, 246, 0.3),
                0 2px 6px rgba(59, 130, 246, 0.2);
        }

        .btn-prev:hover {
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
            transform: translateX(-5px);
        }

        .btn-next:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            transform: translateX(5px);
            box-shadow:
                0 8px 20px rgba(59, 130, 246, 0.4),
                0 4px 8px rgba(59, 130, 246, 0.25);
        }

        .btn-nav:active {
            transform: scale(0.98);
        }

        /* Score Board */
        .score-board {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 12px 20px;
            border-radius: 15px;
            text-align: center;
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 15px;
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }

        /* Memory Game Styles */
        .memory-game {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .memory-card {
            aspect-ratio: 1;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            border-radius: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5em;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
            position: relative;
            transform-style: preserve-3d;
            color: white;
        }

        .memory-card:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
        }

        .memory-card.flipped {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            transform: rotateY(180deg);
            color: #1e40af;
            border: 3px solid #3b82f6;
        }

        .memory-card.matched {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            animation: matchPulse 0.5s;
            color: white;
        }

        @keyframes matchPulse {

            0%,
            100% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.15);
            }
        }

        .game-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }

        .stat-card {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(37, 99, 235, 0.2);
        }

        .stat-card .number {
            font-size: 2.5em;
            font-weight: bold;
        }

        .stat-card .label {
            font-size: 1em;
            margin-top: 5px;
        }

        /* Quiz Styles */
        .quiz-container {
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .question {
            margin-bottom: 30px;
        }

        .question h3 {
            color: #1e40af;
            font-size: 1.5em;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 10px;
            border-left: 5px solid #3b82f6;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .option {
            padding: 20px;
            background: #f8f9fa;
            border: 3px solid transparent;
            border-radius: 15px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 1.1em;
        }

        .option:hover {
            background: #eff6ff;
            transform: translateX(10px);
            border-color: #3b82f6;
        }

        .option.selected {
            border-color: #3b82f6;
            background: #dbeafe;
            font-weight: bold;
        }

        .option.correct {
            border-color: #22c55e;
            background: #dcfce7;
        }

        .option.wrong {
            border-color: #ef4444;
            background: #fee2e2;
        }

        .progress-bar {
            background: #e2e8f0;
            border-radius: 15px;
            height: 30px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-fill {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            height: 100%;
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        .result-message {
            text-align: center;
            padding: 30px;
            margin: 20px 0;
            border-radius: 15px;
            font-size: 1.5em;
            font-weight: bold;
        }

        .result-success {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
        }

        .result-fail {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
        }

        .celebration {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        }

        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: fall 3s linear infinite;
        }

@keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
            }
        }

        /* Estilos Timeline Bombillas */
        .bulb-timeline {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 0;
          position: relative;
        }

        .bulb-item {
          display: flex;
          align-items: center;
          margin-bottom: 3rem;
          position: relative;
          gap: 2rem;
        }

        .bulb-item:nth-child(even) {
          flex-direction: row-reverse;
        }

        .bulb-shape {
          position: relative;
          width: 120px;
          height: 120px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
          flex-shrink: 0;
        }

        .bulb-shape::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 15px;
          background: inherit;
          border-radius: 50% 50% 0 0;
          opacity: 0.8;
        }

        .bulb-shape::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 10px;
          background: inherit;
          border-radius: 0 0 50% 50%;
          opacity: 0.6;
        }

        .bulb-yellow {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #92400e;
        }

        .bulb-red {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .bulb-blue {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        .bulb-purple {
          background: linear-gradient(135deg, #a855f7, #9333ea);
          color: white;
        }

        .bulb-green {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .bulb-shape:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
        }

        .bulb-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .bulb-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
        }

        .bulb-content {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-left: 4px solid;
          transition: all 0.3s ease;
        }

        .bulb-item:nth-child(1) .bulb-content {
          border-left-color: #f59e0b;
        }

        .bulb-item:nth-child(2) .bulb-content {
          border-left-color: #dc2626;
        }

        .bulb-item:nth-child(3) .bulb-content {
          border-left-color: #2563eb;
        }

        .bulb-item:nth-child(4) .bulb-content {
          border-left-color: #9333ea;
        }

        .bulb-item:nth-child(5) .bulb-content {
          border-left-color: #059669;
        }

        .bulb-content:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .mobile-title {
          display: none;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--color-text-primary);
        }

        .bulb-content ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .bulb-content li {
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          padding-left: 1.5rem;
        }

        .bulb-content li:last-child {
          border-bottom: none;
        }

        .bulb-content li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: currentColor;
          font-weight: bold;
        }

        /* Línea conectora */
        .bulb-timeline::before {
          content: '';
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: calc(100% - 120px);
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
          z-index: -1;
        }

        /* Media queries para móvil */
        @media (max-width: 768px) {
          /* Timeline móvil */
          .bulb-timeline {
            padding: 1rem 0;
          }

          .bulb-item {
            flex-direction: column !important;
            margin-bottom: 2rem;
            gap: 1rem;
            text-align: center;
          }

          .bulb-shape {
            width: 100px;
            height: 100px;
            order: 2;
          }

          .bulb-content {
            order: 1;
            width: 100%;
            text-align: left;
          }

          .mobile-title {
            display: block;
          }

          .bulb-title {
            display: none;
          }

          .bulb-timeline::before {
            display: none;
          }

          .bulb-content li {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .bulb-shape {
            width: 80px;
            height: 80px;
          }

          .bulb-icon {
            font-size: 1.5rem;
          }

          .bulb-content {
            padding: 1.5rem;
          }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="module-header">
            <h2 style="color: #1e40af; margin: 0; font-size: 1.5rem;">📚 Gestión Humana</h2>
            <div class="progress-indicator dots-container" id="dots-container"></div>
        </div>

        <div class="score-board">
            ⭐ Puntos: <span id="score">0</span> | 🏆 Nivel: <span id="level">Principiante</span>
        </div>

        <!-- SLIDE 1: Introducción -->
        <div class="slide active" id="slide-1">
            <h1 class="slide-title">🏢 ¿Qué es Infibagué?</h1>
            <p class="slide-description">Instituto de Financiamiento, Promoción y Desarrollo de Ibagué</p>

            <div class="lesson-card">
                <p><strong>El Instituto de Financiamiento, Promoción y Desarrollo de Ibagué – INFIBAGUÉ</strong>, es un
                    establecimiento público del orden municipal, dotado de personería jurídica, autonomía
                    administrativa, presupuestal y patrimonio propio e independiente.</p>

                <div class="info-box">
                    <p><strong>🏛️ Marco Legal:</strong></p>
                    <p>Se rige por la Constitución Política, la Ley 489 de 1998, y por el Decreto 0183 de 2001
                        (modificado por los Acuerdos 003 de Mayo de 2018, el Acuerdo 001 de 2019 y el Acuerdo 005 de
                        2021).</p>
                </div>

                <p><strong>Funciones principales:</strong></p>
                <div class="info-box">
                    <p>💡 <strong>Alumbrado Público:</strong> Gestión y mantenimiento de la iluminación de la ciudad</p>
                    <p>🏪 <strong>Plazas de Mercado:</strong> Administración de espacios comerciales</p>
                    <p>🌳 <strong>Parques y Zonas Verdes:</strong> Mantenimiento de espacios públicos</p>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" disabled style="opacity: 0.5;">Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(1)">Siguiente →</button>
            </div>
        </div>

        <!-- SLIDE 2: Plataforma Estratégica -->
        <div class="slide" id="slide-2">
            <h1 class="slide-title">🎯 Plataforma Estratégica</h1>
            <p class="slide-description">Misión y Visión de Infibagué</p>

            <div class="lesson-card">
                <h3>MISIÓN:</h3>
                <p>Ser <strong>generador de desarrollo</strong> para la comunidad Ibaguereña, su zona de influencia y
                    entes gubernamentales mediante la oferta de productos financieros, creación de esquemas
                    empresariales y prestación eficaz de servicios públicos con compromiso social y transparencia a
                    través de un talento humano altamente calificado y comprometido.</p>
            </div>

            <div class="lesson-card">
                <h3>VISIÓN:</h3>
                <p>INFIBAGUE para el 2025 debe ser un <strong>núcleo de excelencia</strong> de la Administración
                    Municipal, Generador y Promotor de esquemas empresariales para el desarrollo social, económico y
                    ambiental del Municipio de Ibagué y administrador responsable y efectivo del portafolio de
                    inversiones.</p>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(2)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(2)">Valores →</button>
            </div>
        </div>

        <!-- SLIDE 3: Valores Corporativos -->
        <div class="slide" id="slide-3">
            <h1 class="slide-title">💎 Código de Integridad</h1>
            <p class="slide-description">Valores que guían el actuar de todos los colaboradores</p>

            <div class="values-grid">
                <div class="value-card" onclick="showValue('honestidad')">
                    <div class="icon">🤝</div>
                    <h3>HONESTIDAD</h3>
                    <p>Actuar con verdad y transparencia</p>
                </div>
                <div class="value-card" onclick="showValue('respeto')">
                    <div class="icon">🙏</div>
                    <h3>RESPETO</h3>
                    <p>Reconocer y valorar a los demás</p>
                </div>
                <div class="value-card" onclick="showValue('justicia')">
                    <div class="icon">⚖️</div>
                    <h3>JUSTICIA</h3>
                    <p>Dar a cada uno lo que corresponde</p>
                </div>
                <div class="value-card" onclick="showValue('diligencia')">
                    <div class="icon">⚡</div>
                    <h3>DILIGENCIA</h3>
                    <p>Actuar con prontitud y eficacia</p>
                </div>
                <div class="value-card" onclick="showValue('compromiso')">
                    <div class="icon">💪</div>
                    <h3>COMPROMISO</h3>
                    <p>Cumplir con responsabilidad</p>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(3)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(3)">Estructura →</button>
            </div>
        </div>

        <!-- SLIDE 4: Estructura Organizacional -->
        <div class="slide" id="slide-4">
            <h1 class="slide-title">🏗️ Estructura Organizacional</h1>
            <p class="slide-description">Cuatro Direcciones principales</p>

            <div class="directions-grid">
                <div class="direction-card">
                    <div class="icon">💰</div>
                    <strong>Dirección de Proyectos y Servicios Financieros</strong>
                    <p>Gestión de proyectos y productos financieros</p>
                </div>
                <div class="direction-card">
                    <div class="icon">📋</div>
                    <strong>Dirección de Servicios Administrativos</strong>
                    <p>Gestión, PQRS y Comunicaciones</p>
                </div>
                <div class="direction-card">
                    <div class="icon">💵</div>
                    <strong>Dirección Financiera</strong>
                    <p>Gestión financiera y contable</p>
                </div>
                <div class="direction-card">
                    <div class="icon">⚙️</div>
                    <strong>Dirección Operativa y Comercial</strong>
                    <p>Atención en campo y técnica</p>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(4)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(4)">Procesos →</button>
            </div>
        </div>

        <!-- SLIDE 5: Mapa de Procesos -->
        <div class="slide" id="slide-5">
            <h1 class="slide-title">📊 Mapa de Procesos</h1>
            <p class="slide-description">Cuatro tipos de procesos principales</p>

            <div class="directions-grid">
                <div class="direction-card">
                    <div class="icon">🎯</div>
                    <strong>Procesos Estratégicos</strong>
                    <p>Dirección y planificación institucional</p>
                </div>
                <div class="direction-card">
                    <div class="icon">⚙️</div>
                    <strong>Procesos Misionales</strong>
                    <p>Actividades principales del Instituto</p>
                </div>
                <div class="direction-card">
                    <div class="icon">📊</div>
                    <strong>Procesos de Evaluación</strong>
                    <p>Seguimiento y control de gestión</p>
                </div>
                <div class="direction-card">
                    <div class="icon">🤝</div>
                    <strong>Procesos de Apoyo</strong>
                    <p>Soporte y recursos para operación</p>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(5)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(5)">Gestión Humana →</button>
            </div>
        </div>

        <!-- SLIDE 6: Gestión Humana -->
        <div class="slide" id="slide-6">
            <h1 class="slide-title">👥 Gestión Humana</h1>
            <p class="slide-description">Desarrollo integral del talento humano</p>

            <div class="lesson-card">
                <p><strong>La Oficina de Gestión Humana</strong> es responsable del talento humano del Instituto y
                    maneja tres planes fundamentales:</p>

                <div class="info-box">
                    <h3>📋 Planes de Gestión Humana:</h3>
                    <p><strong>🎉 Plan Institucional de Bienestar:</strong> Fomenta el bienestar y motivación en el
                        ambiente laboral, propiciando un mejoramiento de la calidad de vida de los funcionarios y sus
                        familias.</p>
                    <p><strong>📚 Plan de Capacitación:</strong> Desarrollo de competencias y actualización del
                        conocimiento del personal.</p>
                    <p><strong>🎁 Plan de Estímulos e Incentivos:</strong> Reconocimiento al desempeño y logros de los
                        colaboradores.</p>
                </div>

                <div class="info-box" style="margin-top: 20px;">
                    <h3>🎯 Objetivo Principal:</h3>
                    <p>Lograr un desempeño institucional con mayor eficiencia y eficacia a través del desarrollo
                        integral del talento humano.</p>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(6)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(6)">Personal →</button>
            </div>
</div>

        <!-- SLIDE 7: Actividades Infibagué -->
        <div class="slide" id="slide-7">
            <h1 class="slide-title">🌱 Actividades Infibagué</h1>
            <p class="slide-description">Líneas de acción y desarrollo urbano</p>

            <div class="bulb-timeline">
                <!-- 1. Plazas de Mercado (Yellow) -->
                <div class="bulb-item">
                    <div class="bulb-shape bulb-yellow">
                        <i class="fas fa-store bulb-icon"></i>
                        <span class="bulb-title">Plazas de Mercado</span>
                    </div>
                    <div class="bulb-content">
                        <div class="mobile-title">Plazas de Mercado</div>
                        <ul>
                            <li>Adjudicaciones</li>
                            <li>Contratos de Uso</li>
                            <li>Recuperación Infraestructura</li>
                        </ul>
                    </div>
                </div>

                <!-- 2. Alumbrado Público (Red) -->
                <div class="bulb-item">
                    <div class="bulb-content">
                        <div class="mobile-title">Alumbrado Público</div>
                        <ul>
                            <li>Mantenimiento</li>
                            <li>Modernización</li>
                            <li>Ampliación Cobertura</li>
                        </ul>
                    </div>
                    <div class="bulb-shape bulb-red">
                        <i class="fas fa-lightbulb bulb-icon"></i>
                        <span class="bulb-title">Alumbrado Público</span>
                    </div>
                </div>

                <!-- 3. Financiamiento (Blue) -->
                <div class="bulb-item">
                    <div class="bulb-shape bulb-blue">
                        <i class="fas fa-hand-holding-dollar bulb-icon"></i>
                        <span class="bulb-title">Fomento y Desarrollo</span>
                    </div>
                    <div class="bulb-content">
                        <div class="mobile-title">Financiamiento y Desarrollo</div>
                        <ul>
                            <li>Captación Excedentes</li>
                            <li>Colocación Recursos</li>
                            <li>Gestión Territorial</li>
                        </ul>
                    </div>
                </div>

                <!-- 4. Otros Proyectos (Purple) -->
                <div class="bulb-item">
                    <div class="bulb-content">
                        <div class="mobile-title">Otros Proyectos</div>
                        <ul>
                            <li>Bicicletas Públicas</li>
                            <li>Eventos Feriales</li>
                            <li>Complejo Panóptico</li>
                            <li>Admin. Inmuebles</li>
                        </ul>
                    </div>
                    <div class="bulb-shape bulb-purple">
                        <i class="fas fa-bicycle bulb-icon"></i>
                        <span class="bulb-title">Otros Proyectos</span>
                    </div>
                </div>

                <!-- 5. Parques y Zonas Verdes (Green) -->
                <div class="bulb-item">
                    <div class="bulb-shape bulb-green">
                        <i class="fas fa-tree bulb-icon"></i>
                        <span class="bulb-title">Parques y Zonas Verdes</span>
                    </div>
                    <div class="bulb-content">
                        <div class="mobile-title">Parques y Zonas Verdes</div>
                        <ul>
                            <li>Rocerías y Podas</li>
                            <li>Siembra Ornato</li>
                            <li>Parques Biosaludables</li>
                            <li>Mtto. Relleno Sanitario</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(7)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(7)">Personal →</button>
            </div>
        </div>

        <!-- SLIDE 8: Conformación Personal -->
        <div class="slide" id="slide-8">
            <h1 class="slide-title">📄 Conformación de Personal</h1>
            <p class="slide-description">Distribución según Acuerdos 2025</p>

            <div class="directions-grid">
                <div class="direction-card">
                    <div class="icon">👔</div>
                    <strong>61%</strong>
                    <p>Planta Permanente</p>
                </div>
                <div class="direction-card">
                    <div class="icon">💡</div>
                    <strong>10%</strong>
                    <p>Alumbrado Público</p>
                </div>
                <div class="direction-card">
                    <div class="icon">🏪</div>
                    <strong>29%</strong>
                    <p>Plazas de Mercado</p>
                </div>
            </div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(8)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(8)">Actividad Interactiva 🎮</button>
            </div>
        </div>

        <!-- SLIDE 9: Juego de Memoria -->
        <div class="slide" id="slide-9">
            <h1 class="slide-title">🎮 Actividad Interactiva</h1>
            <p class="slide-description">Encuentra los pares de conceptos de Infibagué</p>

            <div class="game-stats">
                <div class="stat-card">
                    <div class="number" id="moves">0</div>
                    <div class="label">Movimientos</div>
                </div>
                <div class="stat-card">
                    <div class="number" id="matches">0</div>
                    <div class="label">Parejas</div>
                </div>
                <div class="stat-card">
                    <div class="number" id="gameScore">0</div>
                    <div class="label">Puntos</div>
                </div>
            </div>

            <div class="memory-game" id="memoryGame"></div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(9)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="nextSlide(9)">Evaluación 📝</button>
            </div>
        </div>

        <!-- SLIDE 10: Quiz/Evaluación -->
        <div class="slide" id="slide-10">
            <h1 class="slide-title">📝 Evaluación</h1>
            <p class="slide-description">Demuestra lo que aprendiste</p>

            <div class="progress-bar">
                <div class="progress-fill" id="quizProgress" style="width: 0%">0%</div>
            </div>

            <div class="quiz-container" id="quizQuestions"></div>

            <div class="nav-buttons">
                <button class="btn-nav btn-prev" onclick="prevSlide(10)">← Atrás</button>
                <button class="btn-nav btn-next" onclick="checkQuiz()">Revisar Respuestas ✅</button>
            </div>
        </div>

        <!-- SLIDE 11: Resultados -->
        <div class="slide" id="slide-11">
            <h1 class="slide-title" id="result-title">Calculando...</h1>

            <div id="quizResult" class="result-message"
                style="min-height: 300px; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
                <div style="font-size: 1.2rem; color: #64748b;">Evaluando respuestas...</div>
            </div>

            <div class="nav-buttons" style="justify-content: center;">
                <button class="btn-nav" id="btn-retry"
                    style="display: none; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);"
                    onclick="retryQuiz()">🔄 Reintentar</button>
                <button class="btn-nav btn-next" id="btn-next-module" style="display: none;"
                    onclick="goToNextModule()">Ir a Gestión Ambiental 🌿 →</button>
            </div>
        </div>
    </div>

    <div class="celebration" id="celebration"></div>

    <script src="../js/auth.js"></script>
    <script src="../js/utils.js"></script>
    <script src="../js/gestion-humana-game.js"></script>
    <script>
        // Initial setup
        let totalScore = 0;
        let level = 'Principiante';
        let currentSlide = 1;
        const totalSlides = 11;

        // Initialize dots
        const dotsContainer = document.getElementById('dots-container');
        for (let i = 1; i <= totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 1 ? 'active' : ''}`;
            dot.id = `dot-${i}`;
            dotsContainer.appendChild(dot);
        }

        function updateDots() {
            document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
            const dot = document.getElementById(`dot-${currentSlide}`);
            if (dot) dot.classList.add('active');
        }

        function nextSlide(current) {
            document.getElementById(`slide-${current}`).classList.remove('active');
            currentSlide = current + 1;
            if (currentSlide > totalSlides) currentSlide = totalSlides;
            document.getElementById(`slide-${currentSlide}`).classList.add('active');
            updateDots();

        // Initialize game and quiz when reaching those slides
            if (currentSlide === 9 && typeof initMemoryGame === 'function') initMemoryGame();
            if (currentSlide === 10 && typeof initQuiz === 'function') initQuiz();
        }

        function prevSlide(current) {
            document.getElementById(`slide-${current}`).classList.remove('active');
            currentSlide = current - 1;
            if (currentSlide < 1) currentSlide = 1;
            document.getElementById(`slide-${currentSlide}`).classList.add('active');
            updateDots();
        }

        function updateScore(points) {
            totalScore += points;
            document.getElementById('score').textContent = totalScore;

            if (totalScore >= 500) level = '🌟 Experto';
            else if (totalScore >= 300) level = '⭐ Avanzado';
            else if (totalScore >= 150) level = '✨ Intermedio';

            document.getElementById('level').textContent = level;
        }

        // Variables para el quiz
        let quizScore = 0;
        let totalQuizQuestions = 0;

        // Función para mostrar resultados del quiz
        function showQuizResults(score, total) {
            quizScore = score;
            totalQuizQuestions = total;
            const percentage = Math.round((score / total) * 100);
            const passed = percentage >= 70;

            const resultTitle = document.getElementById('result-title');
            const quizResult = document.getElementById('quizResult');
            const btnRetry = document.getElementById('btn-retry');
            const btnNextModule = document.getElementById('btn-next-module');

            if (passed) {
                // Aprobado (≥70%)
                resultTitle.textContent = '🎉 ¡Felicitaciones!';
                quizResult.innerHTML = `
                    <div class="result-success" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; border-radius: 15px;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
                        <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">¡Has aprobado el módulo!</h2>
                        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Puntuación: <strong>${score}/${total} (${percentage}%)</strong></p>
                        <p style="font-size: 1rem;">Excelente trabajo. Ahora puedes continuar con el siguiente módulo.</p>
                    </div>
                `;
                quizResult.className = 'result-message result-success';
                
                btnRetry.style.display = 'none';
                btnNextModule.style.display = 'flex';

                // Guardar progreso en localStorage
                localStorage.setItem('gestionHumanaCompleted', 'true');
                localStorage.setItem('gestionHumanaScore', percentage);
                localStorage.setItem('gestionHumanaCompletedDate', new Date().toISOString());

                // Celebración
                createCelebration();
            } else {
                // Reprobado (<70%)
                resultTitle.textContent = '💪 ¡Inténtalo de nuevo!';
                quizResult.innerHTML = `
                    <div class="result-fail" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 15px;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">📚</div>
                        <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">Necesitas repasar un poco más</h2>
                        <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">Puntuación: <strong>${score}/${total} (${percentage}%)</strong></p>
                        <p style="font-size: 1rem;">Necesitas al menos 70% para aprobar. No te preocupes, repasa el contenido e intenta nuevamente.</p>
                    </div>
                `;
                quizResult.className = 'result-message result-fail';
                
                btnRetry.style.display = 'flex';
                btnNextModule.style.display = 'none';
            }
        }

        // Función para reintentar el quiz
        function retryQuiz() {
            // Resetear el quiz
            quizScore = 0;
            
            // Volver al slide del quiz
            document.getElementById('slide-11').classList.remove('active');
            document.getElementById('slide-10').classList.add('active');
            currentSlide = 10;
            updateDots();

            // Reiniciar el quiz
            if (typeof initQuiz === 'function') {
                initQuiz();
            }

            // Limpiar el mensaje de resultado
            document.getElementById('result-title').textContent = 'Calculando...';
            document.getElementById('quizResult').innerHTML = `
                <div style="font-size: 4rem; margin-bottom: 1rem;">⏳</div>
                <div style="font-size: 1.2rem; color: #64748b;">Evaluando respuestas...</div>
            `;
            document.getElementById('btn-retry').style.display = 'none';
            document.getElementById('btn-next-module').style.display = 'none';
        }

        // Función para ir al siguiente módulo
        function goToNextModule() {
            // Guardar progreso antes de redirigir
            localStorage.setItem('gestionHumanaCompleted', 'true');
            localStorage.setItem('gestionHumanaScore', Math.round((quizScore / totalQuizQuestions) * 100));
            localStorage.setItem('gestionHumanaCompletedDate', new Date().toISOString());
            
            // Redirigir al módulo de Gestión Ambiental
            window.location.href = './induccion-gestion-ambiental.html';
        }

        // Función para crear celebración
        function createCelebration() {
            const celebration = document.getElementById('celebration');
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8'];
            
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 3 + 's';
                confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
                celebration.appendChild(confetti);
            }

            // Limpiar confetti después de 5 segundos
            setTimeout(() => {
                celebration.innerHTML = '';
            }, 5000);
        }
    </script>
</body>

</html>