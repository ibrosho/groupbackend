import mongoose from "mongoose"
import dns from "node:dns"

// Force a public, SRV-capable DNS resolver so `mongodb+srv://` lookups don't
// fail with `querySrv ECONNREFUSED _mongodb` on hosts whose local resolver
// (systemd-resolved, captive portals, restrictive corp DNS) refuses SRV.
// Note: dns.setServers is often restricted in serverless environments like Vercel.
const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

if (dnsServers.length > 0 && process.env.NODE_ENV !== 'production') {
    // Only override DNS locally to fix SRV issues; Vercel handles this natively.
    dns.setServers(dnsServers);
}

export const connectDB = async (uri, { timeoutMs = 15000 } = {}) => {
    return mongoose.connect(uri, {
        serverSelectionTimeoutMS: timeoutMs,
        // Prefer IPv4 — some networks resolve AAAA records that then time out.
        family: 4,
    })
}

export const disconnectDB = () => mongoose.disconnect()