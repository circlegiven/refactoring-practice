import plays from "../data/plays.js";
import invoices from "../data/invoices.js";

function statement(invoice, plays) {
    let totalAmount = 0;

    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency", currency: "USD", minimumFractionDigits: 2
    }).format;

    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);
        // 청구 내역을 출력
        result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${perf.audience}석)\n`;
        totalAmount += amountFor(perf);
    }
    result += `총액: ${format(totalAmount / 100)}\n`;
    result += `적립 포인트: ${volumeCredits}점\n`;
    return result;
}

function volumeCreditsFor(aPerformance) {
    let result = 0;
    // 포인트를 적립
    result += Math.max(aPerformance.audience - 30, 0);
    // 희극 관객 5명 마다 추가포인트 제공
    if ("comedy" === playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
    }
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
    let result = 0;

    switch (playFor(aPerformance).type) {
        case "tragedy": // 비극
            result = 40000;
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy":  // 희극
            result = 30000;
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`알수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
}

console.log(statement(invoices[0], plays));