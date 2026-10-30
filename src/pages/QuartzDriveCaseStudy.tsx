import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import quartzArchitectureSvg from '../assets/quartz_architecture.svg';

export const QuartzDriveCaseStudy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="min-h-screen bg-white text-zinc-900 font-mono text-sm leading-relaxed p-6 md:p-12 lg:p-24 max-w-4xl mx-auto rounded-xl border border-gray-300 selection:bg-zinc-900 selection:text-white my-4 shadow-xs">

      <nav className="mb-10 pb-4 border-b border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
        <Link to="/" className="hover:text-black transition-colors font-medium">
          &larr; Back to Portfolio
        </Link>
        <span>Case Study &bull; Quartz Drive</span>
      </nav>

      <header className="space-y-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-black">Quartz Drive</h1>
            <span className="text-xs text-zinc-500 font-normal">Alpha</span>
          </div>
          <p className="text-zinc-700 text-sm leading-normal">
            End-to-end encrypted cloud storage where the server never sees passwords or plaintext files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs pt-1">
          <a
            href="https://quartzapp.top?utm_source=portfolio&utm_medium=link&utm_campaign=demo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-semibold underline underline-offset-4 hover:text-zinc-600"
          >
            Live Demo &rarr;
          </a>
          <span className="text-zinc-300">/</span>
          <a
            href="https://github.com/jacobinoo/quartz-drive"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black font-semibold underline underline-offset-4 hover:text-zinc-600"
          >
            GitHub &rarr;
          </a>
        </div>

        <div className="text-xs text-zinc-500 pt-2 border-t border-zinc-100">
          <strong>Stack:</strong> Go, Kubernetes (k3s), Docker, PostgreSQL, Valkey, Backblaze B2, Cloudflare Tunnel, Next.js, OPAQUE
        </div>
      </header>

      <section className="mb-14 space-y-3">
        <div className="bg-[#121212] rounded-lg border border-zinc-800 p-2 sm:p-4 flex justify-center overflow-hidden shadow-xs">
          <img
            src={quartzArchitectureSvg}
            alt="Browser &rarr; Cloudflare &rarr; cloudflared in k3s &rarr; Go API with PostgreSQL and Valkey; browser uploads encrypted chunks directly to Backblaze B2."
            className="w-full h-auto max-w-2xl object-contain select-none"
            loading="eager"
          />
        </div>
        <div className="text-xs text-zinc-600 space-y-1.5">
          <p><strong>Request Flow:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><strong>Authentication:</strong> OPAQUE PAKE derives cryptographic session keys, authenticating the client without transmitting passwords or password hashes over the wire.</li>
            <li><strong>Client-Side Encryption:</strong> Files are sliced into 4MB chunks and encrypted client-side in browser memory via XChaCha20-Poly1305 before any data leaves the device.</li>
            <li><strong>Cluster Routing & Ingress:</strong> The client sends a request to the server to get presigned upload URLs. The request reaches Cloudflare Edge (where WAF, DDoS protection, and TLS termination occur) and proxies through the in-cluster <code className="bg-zinc-100 px-1 py-0.5 rounded">cloudflared</code> tunnel pod directly to the Go REST API inside the k3s cluster.</li>
            <li><strong>Session & Rate Limit Handling:</strong> Valkey (KV storage) enforces rate limiting. The Go backend records an upload session marked as pending in PostgreSQL, generates presigned B2 (S3-compatible) PUT URLs, and returns them to the client.</li>
            <li><strong>Direct Storage Upload:</strong> The browser streams the end-to-end encrypted chunks directly to Backblaze B2 Cloud Storage using the presigned URLs, completely bypassing the API server.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4 mb-14">
        <h2 className="text-base font-bold text-black border-b border-zinc-200 pb-1">
          1. Problem and Goals
        </h2>

        <div className="space-y-2 text-zinc-700">
          <p>
            <strong>The Problem:</strong> Mainstream consumer storage (Google Drive, Dropbox, OneDrive) typically holds master encryption keys server-side. A server compromise can expose stored data, and the server operator can read files.
          </p>
          <p>
            <strong>The Architecture that Solves This:</strong> Quartz Drive is engineered around an <em>end-to-end encrypted architecture</em>. Encryption, key derivation, and chunk slicing execute entirely within the client's browser before any bytes leave the device. The Go server acts solely as a blind coordinator for encrypted metadata and presigned storage dispatch.
          </p>
        </div>

        <div className="space-y-1 text-zinc-700">
          <p><strong>Project Goals:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-xs">
            <li><strong>Server Never Sees Passwords or Plaintext:</strong> Server never receives passwords, and never receives or stores unencrypted keys or file contents.</li>
            <li><strong>Direct Large-File Uploads:</strong> Multi-gigabyte files upload directly to storage with bounded browser RAM (40MB queue) and per-chunk retries, bypassing API server bandwidth entirely.</li>
            <li><strong>Zero-Downtime Operations:</strong> Deployments must execute reliably with automated health verification and immediate rollback capability.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6 mb-14">
        <h2 className="text-base font-bold text-black border-b border-zinc-200 pb-1">
          2. Key Decisions
        </h2>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-black">
            1. Presigned URLs Instead of Proxying Data Through the Server
          </h3>
          <p className="text-zinc-700">
            <strong>Why:</strong> Instead of streaming files through Go API instances, the client requests presigned PUT URLs and uploads 4MB encrypted chunks directly to Backblaze B2. This prevents server RAM exhaustion and keeps backend bandwidth usage near zero regardless of upload size.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Alternative rejected:</strong> Streaming uploads through the Go API server (saturates CPU/bandwidth under concurrency) or single not-chunked uploads (fails completely on transient network drops).
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Tradeoff:</strong> Slicing files into 4MB chunks increases total HTTP request counts. Pre-generating or batching presigned URLs is a planned optimization to reduce per-chunk round-trips.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-black">
            2. OPAQUE PAKE Instead of Password Hashes
          </h3>
          <p className="text-zinc-700">
            <strong>Why:</strong> Traditional password hashing (bcrypt, Argon2) requires the server to receive plaintext passwords in memory over TLS before hashing. OPAQUE is an asymmetric Password-Authenticated Key Exchange protocol where the password never leaves the user's device. The server never sees the password, and a stolen database alone does not allow offline dictionary attacks without the server's private key.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Alternative rejected:</strong> Standard server-side Argon2id hashing. Even over TLS, server-side hashing requires the API server to briefly handle plaintext user passwords in memory, exposing credentials if the application runtime is compromised.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Tradeoff:</strong> Required compiling the Rust <code className="bg-zinc-100 px-1 py-0.5 rounded">opaque-ke</code> library into a shared C library (<code className="bg-zinc-100 px-1 py-0.5 rounded">.so</code>) called from Go via CGO, introducing dynamic linking and cross-compilation complexity.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-black">
            3. Custom Go Deployer (qdeploy) for Lightweight Zero-Downtime Rollouts
          </h3>
          <p className="text-zinc-700">
            <strong>Why:</strong> To understand container lifecycle mechanics from the ground up, I engineered <code className="bg-zinc-100 px-1 py-0.5 rounded">qdeploy</code> in Go. It orchestrates blue/green deployments on a single host using Docker Compose scaling (<code className="bg-zinc-100 px-1 py-0.5 rounded">--scale service=2 --no-recreate</code>), atomic PID lockfiles, and active container health inspection.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Alternative rejected:</strong> A blue/green deployment script in bash. I first wrote blue/green in bash, but rewrote it in Go because ID-grepping was fragile, there was no concurrency locking, and failures were hard to debug.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Tradeoff:</strong> Maintaining custom Go orchestration code rather than relying on off-the-shelf runners.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-black">
            4. Moving from Docker Compose to Kubernetes (k3s) on Oracle Cloud
          </h3>
          <p className="text-zinc-700">
            <strong>Why:</strong> Two reasons. Practical: my GCP e2-micro (1 GB RAM) had no room to grow, while Oracle's free Ampere VMs gave me enough capacity to run a 2-node cluster (one control-plane/worker node plus a dedicated worker node). Learning: <code className="bg-zinc-100 px-1 py-0.5 rounded">qdeploy</code> reimplements by hand things Kubernetes does natively (readiness checks, rolling updates, restarting failed containers), and I wanted to see the difference firsthand. The stack now runs as Deployments with a readiness probe on <code className="bg-zinc-100 px-1 py-0.5 rounded">/up</code>, a StatefulSet with a PersistentVolumeClaim for PostgreSQL, ClusterIP Services, and <code className="bg-zinc-100 px-1 py-0.5 rounded">cloudflared</code> as an in-cluster Deployment.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Alternative rejected:</strong> Staying on Compose with qdeploy, which works well for a single VM and is still in the repo. Managed Kubernetes (GKE/AKS) was rejected because it costs money and hides the parts I wanted to learn.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Tradeoff:</strong> More manifests and operational complexity. It is a 2-node cluster, so workloads are distributed across nodes, but the control plane is single-master and PostgreSQL runs as a single instance with a node-bound PersistentVolume rather than a distributed HA database. That is acceptable for demo data, not for real user data.
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-semibold text-black">
            5. Email Enumeration and Abuse Resistance
          </h3>
          <p className="text-zinc-700">
            <strong>Why:</strong> In privacy-preserving authentication protocols, returning an immediate 404 for unknown accounts leaks user registration status. The backend generates a deterministic fake OPAQUE registration record and completes the cryptographic challenge identically for unregistered emails, making user enumeration much harder.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Alternative rejected:</strong> Generic login error messages that still leak user existence through subtle database query timing discrepancies.
          </p>
          <p className="text-zinc-600 text-xs">
            <strong>Tradeoff:</strong> Non-existent users consume equal server cryptographic CPU cycles during login handshakes, requiring Valkey IP-based rate limiting and Cloudflare Turnstile to prevent CPU exhaustion attacks.
          </p>
        </div>
      </section>

      <section className="space-y-4 mb-14">
        <h2 className="text-base font-bold text-black border-b border-zinc-200 pb-1">
          3. Security Model & Trust Boundaries
        </h2>
        <p className="text-zinc-700">
          The design limits what a compromised API, database, or storage bucket can reveal: file contents and names are encrypted client-side and the server never receives passwords. It does not protect against a malicious web client (whoever serves the JavaScript), and weak passwords remain open to offline guessing if the server's OPAQUE secrets and stored key blobs leak.
        </p>

        <div className="border border-zinc-200 rounded overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-700 font-semibold">
              <tr>
                <th className="p-2.5">Asset</th>
                <th className="p-2.5">Server Visibility</th>
                <th className="p-2.5">Storage Location</th>
                <th className="p-2.5">Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-600">
              <tr>
                <td className="p-2.5 font-medium text-black">User Passwords</td>
                <td className="p-2.5 text-zinc-500 font-semibold">&times; Never visible</td>
                <td className="p-2.5">Client memory only</td>
                <td className="p-2.5">OPAQUE PAKE protocol</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">Master Encryption Keys</td>
                <td className="p-2.5 text-zinc-500 font-semibold">&times; Never visible</td>
                <td className="p-2.5">Client IndexedDB</td>
                <td className="p-2.5">Argon2id + Client Device Keys (WebCrypto)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">Encrypted Keys & Envelopes</td>
                <td className="p-2.5 text-zinc-700 font-medium">Ciphertext only</td>
                <td className="p-2.5">PostgreSQL</td>
                <td className="p-2.5">Argon2id for account keys; X-Wing KEM + XChaCha20 for folder key envelopes</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">File Contents</td>
                <td className="p-2.5 text-zinc-500 font-semibold">&times; Never visible</td>
                <td className="p-2.5">Backblaze B2</td>
                <td className="p-2.5">XChaCha20-Poly1305 (4MB chunks)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">File Names</td>
                <td className="p-2.5 text-zinc-500 font-semibold">&times; Never visible</td>
                <td className="p-2.5">PostgreSQL</td>
                <td className="p-2.5">Encrypted client-side (XChaCha20-Poly1305 with parent folder key)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">Folder Structure</td>
                <td className="p-2.5 text-zinc-900 font-medium">&#10003; Visible (UUID graph)</td>
                <td className="p-2.5">PostgreSQL</td>
                <td className="p-2.5">Names hidden, parent/child relationships are not</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">User Email</td>
                <td className="p-2.5 text-zinc-700 font-medium">Plaintext in transit & RAM</td>
                <td className="p-2.5">PostgreSQL</td>
                <td className="p-2.5">Plaintext in transit & memory; stored encrypted with HMAC blind index</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">Chunk Sizes & Hashes</td>
                <td className="p-2.5 text-zinc-900 font-medium">&#10003; Visible</td>
                <td className="p-2.5">PostgreSQL & B2</td>
                <td className="p-2.5">Plaintext integer, SHA-256 integrity checksum</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-black">Activity Timestamps</td>
                <td className="p-2.5 text-zinc-900 font-medium">&#10003; Visible</td>
                <td className="p-2.5">PostgreSQL</td>
                <td className="p-2.5">Metadata for upload lifecycle & session sweep</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-1 pt-1 text-xs text-zinc-600">
          <p><strong>Known Limitations:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            <li><strong>Metadata leakage:</strong> Database or chunk counts reveal total storage consumption and upload timestamps.</li>
            <li><strong>Malicious web host (JS injection):</strong> Browser-based cryptography cannot defend if the web host serves tampered JavaScript to the client.</li>
            <li><strong>Weak passwords under total server compromise:</strong> If both the database key blobs and the server's private OPAQUE seed/pepper leak, weak passwords remain susceptible to offline dictionary attacks.</li>
            <li><strong>Alpha status:</strong> The architecture relies on proven primitives (libsodium, opaque-ke), but the implementation has not undergone a formal third-party audit.</li>
            <li><strong>Zero-recovery:</strong> Because the server holds no master keys, losing the password, device sessions, or recovery keys results in irreversible data loss.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4 mb-14">
        <h2 className="text-base font-bold text-black border-b border-zinc-200 pb-1">
          4. Deployment and Operations (DevOps)
        </h2>
        <p className="text-zinc-700">
          The primary operational goal was <strong> zero-downtime deployments</strong> paired with a locked-down network:
        </p>

        <ul className="list-disc list-inside space-y-1.5 text-zinc-700 text-xs pl-1">
          <li><strong>GitHub Actions:</strong> Pull requests trigger automated Go unit testing and build checking. Merges to master build cached multi-stage Docker images (<code className="bg-zinc-100 px-1 py-0.5 rounded">~2min</code> build time) tagged with commit SHAs.</li>
          <li><strong>Zero-Inbound Attack Surface:</strong> All traffic routes through an in-cluster <code className="bg-zinc-100 px-1 py-0.5 rounded">cloudflared</code> Deployment via an outbound-only encrypted tunnel. Public ports 22, 80, 443, and 6443 remain completely closed in Oracle Cloud security lists; host SSH management is routed privately through a Cloudflare One (Zero Trust / WARP) private mesh network with zero open inbound ports.</li>
          <li><strong>Cluster Rollouts:</strong> On the live k3s cluster, releases update via <code className="bg-zinc-100 px-1 py-0.5 rounded">kubectl set image deployment/quartz-api quartz-api=&lt;image&gt;:sha-&lt;commit&gt;</code>, pinning the immutable SHA tag and triggering a native rolling update. Kubernetes terminates old pods only after new replicas pass the HTTP <code className="bg-zinc-100 px-1 py-0.5 rounded">/up</code> readiness probe. A continuous curl request loop confirmed zero dropped requests during active rollouts.</li>
          <li><strong>Observability & Structured Logging:</strong> JSON logging using Go's <code className="bg-zinc-100 px-1 py-0.5 rounded">slog</code> package. Every incoming request receives a unique <code className="bg-zinc-100 px-1 py-0.5 rounded">X-Request-ID</code> propagated across Go handlers, and Sentry internal server error captures.</li>
        </ul>

        <div className="space-y-1 pt-1">
          <div className="text-[11px] text-zinc-500 font-semibold">
            Health-check inspection loop from qdeploy (Go, simplified, from the Compose deployment path):
          </div>
          <div className="bg-zinc-950 text-zinc-200 p-3.5 rounded border border-zinc-800 text-xs overflow-x-auto">
            <pre className="font-mono">
{`func waitForHealth(ctx context.Context, id string, timeout time.Duration) error {
    deadline := time.Now().Add(timeout)
    ticker := time.NewTicker(2 * time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        case <-ticker.C:
            if time.Now().After(deadline) {
                return fmt.Errorf("timeout waiting for container health: %s", id)
            }
            if status, _ := inspectHealth(ctx, id); status == "healthy" {
                return nil // Safe to remove previous container
            }
        }
    }
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-5 mb-14">
        <h2 className="text-base font-bold text-black border-b border-zinc-200 pb-1">
          5. Problems I Hit and How I Fixed Them
        </h2>

        <div className="space-y-1">
          <h3 className="font-semibold text-black text-sm">
            1. Size Validation and Presigned POST Incompatibility on Backblaze B2 S3 API
          </h3>
          <p className="text-zinc-700 text-xs">
            <strong>Problem:</strong> Standard AWS S3 buckets allow for presigned POST policies, which would have allowed me for strict chunk size validation. Backblaze B2 S3 API doesn't support them.
          </p>
          <p className="text-zinc-700 text-xs">
            <strong>Solution:</strong> Used presigned <code className="bg-zinc-100 px-1 py-0.5 rounded">PUT</code> requests signed with MinIO's <code className="bg-zinc-100 px-1 py-0.5 rounded">PresignHeader</code>. The client pre-computes strict <code className="bg-zinc-100 px-1 py-0.5 rounded">Content-Length</code> and <code className="bg-zinc-100 px-1 py-0.5 rounded">x-amz-checksum-sha256</code> headers before requesting the URL. I confirmed experimentally that B2 returns HTTP 403 or signature mismatch if the uploaded payload size deviates from the pre-signed Content-Length by even a single byte.
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-black text-sm">
            2. Sourcing .env in SSH Scripts Breaking Under Special Characters
          </h3>
          <p className="text-zinc-700 text-xs">
            <strong>Problem:</strong> The original shell deployment ran <code className="bg-zinc-100 px-1 py-0.5 rounded">set -a && source .env.production</code> over SSH from CI. Values containing unquoted symbols, spaces, or hashes broke bash syntax under <code className="bg-zinc-100 px-1 py-0.5 rounded">set -e</code>, aborting deploys or leaving child processes with missing environment variables.
          </p>
          <p className="text-zinc-700 text-xs">
            <strong>Solution:</strong> In <code className="bg-zinc-100 px-1 py-0.5 rounded">qdeploy</code>, I implemented a custom parser that reads the env file line-by-line, trims whitespace, strips single/double quotes, and sets variables directly on the process via <code className="bg-zinc-100 px-1 py-0.5 rounded">os.Setenv</code>. All spawned child commands (<code className="bg-zinc-100 px-1 py-0.5 rounded">docker compose</code>) inherit the variables cleanly without shell sourcing discrepancies.
          </p>
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-black text-sm">
            3. Reliably Identifying the New Container in Blue/Green Deploys
          </h3>
          <p className="text-zinc-700 text-xs">
            <strong>Problem:</strong> The original bash script found the new container by grepping container IDs after scaling to two replicas. It was fragile, especially on a first deploy when no old container existed.
          </p>
          <p className="text-zinc-700 text-xs">
            <strong>Solution:</strong> <code className="bg-zinc-100 px-1 py-0.5 rounded">qdeploy</code> snapshots the running container IDs before scaling up and takes the set difference afterward. Old containers are stopped only after the new one is healthy. On failure it logs the container's last lines, removes the new container, and restores the scale.
          </p>
        </div>
      </section>

      <section className="space-y-3 mb-14">
        <h2 className="text-base font-bold text-black border-b border-zinc-200 pb-1">
          6. What I'd Do Next
        </h2>
        <ul className="list-disc list-inside space-y-1.5 text-zinc-700 text-xs pl-1">
          <li><strong>Automated Database Backups:</strong> Implement scheduled CronJobs running <code className="bg-zinc-100 px-1 py-0.5 rounded">pg_dump</code> with client-side encryption streamed directly to Backblaze B2, complete with an automated restore drill (mitigating the single-instance Postgres operational gap).</li>
          <li><strong>Infrastructure as Code (Terraform):</strong> Codify Oracle Cloud infrastructure (VCN, compute instances, security lists) and Cloudflare DNS/Tunnel configurations into declarative Terraform modules.</li>
          <li><strong>Enhanced Rate Limiting:</strong> Implement distributed sliding-window token buckets in Valkey to throttle abusive requests for download URL generation.</li>
          <li><strong>Expanded Test Coverage:</strong> Add more end-to-end integration tests and k6 flows.</li>
          <li><strong>Cluster Monitoring & Metrics:</strong> Deploy Prometheus and Grafana into the Kubernetes cluster to collect real-time request rates, and more.</li>
        </ul>
      </section>

      <footer className="pt-6 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
        <div>Quartz Drive Case Study</div>
        <div className="space-x-3">
          <Link to="/" className="text-black hover:underline font-medium">
            Portfolio Home
          </Link>
          <span>&bull;</span>
          <a
            href="https://github.com/jacobinoo/quartz-drive"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:underline font-medium"
          >
            GitHub Repo
          </a>
        </div>
      </footer>

    </article>
  );
};