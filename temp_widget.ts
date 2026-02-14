import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createWalletClient, createPublicClient, custom, PublicClient, WalletClient, http, formatEther, parseEther } from 'viem'
import { celo } from 'viem/chains';
import { GooddollarSavingsSDK } from '@goodsdks/savings-sdk';

@customElement('gooddollar-savings-widget')
export class GooddollarSavingsWidget extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 480px;
      margin: 0 auto;
    }

    .container {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      position: relative;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo {
      width: 48px;
      height: 48px;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo img {
        width: 44px;
        height: 44px;
        box-shadow: rgba(0, 0, 0, 0.075) 0px 6px 10px;
        border-radius: 50%;
        background-color: white;
    }

    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .tab-container {
      display: flex;
      background: #f9fafb;
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 16px;
      border: 1px solid #e5e7eb;
    }

    .tab {
      flex: 1;
      padding: 10px 16px;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #6b7280;
    }

    .tab.active {
      background: #00b0ff;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .input-section {
      background: #f9fafb;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid #e5e7eb;
    }

    .balance-info {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 12px;
      font-size: 14px;
      color: #6b7280;
    }

    .input-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .amount-input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 24px;
      font-weight: 600;
      color: #111827;
      outline: none;
    }

    .max-button {
      background: #ffffff;
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 400;
      color: #374151;
      border: 1px solid #374151;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .max-button:hover {
      border: 1px solid #00b0ff;
      color: #00b0ff;
    }

    .rewards-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 0 4px;
    }

    .rewards-label {
      font-size: 16px;
      color: #374151;
    }

    .rewards-value {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .claim-button {
      background: none;
      border: none;
      color: #0387c3;
      font-size: 16px;
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
    }

    .main-button {
      width: 100%;
      background: #00b0ff;
      border: none;
      border-radius: 12px;
      padding: 16px;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      cursor: pointer;
      margin-bottom: 24px;
      transition: background-color 0.2s ease;
      box-shadow: rgba(11, 27, 102, 0.306) 3px 3px 10px -1px;
    }

    .main-button:hover {
      background: #0387c3;
    }

    .main-button.primary {
      background: #00b0ff;
      color: white;
    }

    .main-button.primary:hover {
      background: #0387c3;
    }

    .stats-section {
      background: #f9fafb;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e5e7eb;
    }

    .stats-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px 0;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .stat-row:last-child {
      border-bottom: none;
    }

    .stat-label {
      font-size: 14px;
      color: #6b7280;
    }

    .stat-value {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .hidden {
      display: none;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .error-message {
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
      padding-left: 4px;
    }
  `
  @property({ type: Object })
  web3Provider: any = null;

  @property({ type: Function })
  connectWallet: (() => void) | undefined = undefined;

  @state()
  activeTab: string = 'stake';

  @state()
  inputAmount: string = '0.0';

  @state()
  walletBalance: bigint = BigInt(0);

  @state()
  currentStake: bigint = BigInt(0);

  @state()
  unclaimedRewards: bigint = BigInt(0);

  @state()
  totalStaked: bigint = BigInt(0);

  @state()
  userWeeklyRewards: bigint = BigInt(0);

  @state()
  annualAPR: number = 0;

  @state()
  interval: NodeJS.Timeout | null = null;

  @state()
  isLoading: boolean = false;

  @state()
  txLoading: boolean = false;

  @state()
  isClaiming: boolean = false;

  @state()
  inputError: string = '';

  @state()
  transactionError: string = '';

  private walletClient: WalletClient | null = null;
  private publicClient: PublicClient | null = null;
  private sdk: GooddollarSavingsSDK | null = null;
  private userAddress: string | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.interval = setInterval(
      () => this.refreshData(),
      30_000
    );
    this.refreshData();
  }
  disconnectedCallback() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('web3Provider')) {
      this.refreshData();
    }
    if (changedProperties.has('walletBalance') || changedProperties.has('currentStake')) {
      this.validateInput();
    }
  }

  render() {
    const isConnected = !!(this.web3Provider && this.web3Provider.isConnected && this.userAddress);
    return html`
      <div class="container">
        <div class="header">
          <div class="logo">
            <img alt="G$ logo" src="https://raw.githubusercontent.com/GoodDollar/GoodDAPP/master/src/assets/Splash/logo.svg" >
          </div>
          <h1 class="title">Gooddollar Savings</h1>
        </div>

        <div class="tab-container">
          <button
            class="tab ${this.activeTab === "stake" ? "active" : ""}"
            @click=${() => this.handleTabClick("stake")}
          >
            Stake
          </button>
          <button
            class="tab ${this.activeTab === "unstake" ? "active" : ""}"
            @click=${() => this.handleTabClick("unstake")}
          >
            Unstake
          </button>
        </div>

        <div class="input-section">
          <div class="balance-info ${!isConnected ? "hidden" : ""}">
            <span>
              ${this.activeTab === "stake"
        ? `Wallet Balance: ${this.isLoading ? 'Loading...' : this.formatBigInt(this.walletBalance)}`
        : `Current Stake: ${this.isLoading ? 'Loading...' : this.formatBigInt(this.currentStake)}`
      }
            </span>
          </div>
          <div class="input-container">
            <input
              type="text"
              class="amount-input"
              .value=${this.inputAmount}
              @input=${this.handleInputChange}
              placeholder="0.0"
            />
            <button class="max-button" @click=${this.handleMaxClick}>Max</button>
          </div>
          ${this.inputError ? html`<div class="error-message">${this.inputError}</div>` : ''}
        </div>

        <div class="rewards-section ${!isConnected ? "hidden" : ""}">
          <span class="rewards-label">Unclaimed Rewards</span>
          <div class="rewards-value">
            <button class="claim-button" @click=${this.handleClaim} ?disabled=${this.isClaiming}>
              ${this.isClaiming ? 'Claiming...' : 'Claim'}
            </button>
            <span>${this.isLoading ? 'Loading...' : this.formatBigInt(this.unclaimedRewards)}</span>
          </div>
        </div>

        ${this.transactionError ? html`<div class="error-message" style="margin-bottom: 16px; text-align: center;">${this.transactionError}</div>` : ''}

        ${!isConnected
        ? html`
          <button class="main-button primary" @click=${this.handleConnectWallet}>
            Connect Wallet
          </button>
        `
        : html`
          <button
            class="main-button"
            @click=${this.activeTab === "stake" ? this.handleStake : this.handleUnstake}
            ?disabled=${this.txLoading}
          >
            ${this.txLoading ? 'Processing...' : (this.activeTab === "stake" ? "Stake" : "Unstake")}
          </button>
        `
      }

        <div class="stats-section">
          <h3 class="stats-title">Staking Statistics</h3>

          <div class="stat-row">
            <span class="stat-label">Total G$ Staked</span>
            <span class="stat-value">${this.isLoading ? 'Loading...' : this.formatBigInt(this.totalStaked)}</span>
          </div>

          ${isConnected
        ? html`
            <div class="stat-row">
              <span class="stat-label">Your G$ Stake Pool Share</span>
              <span class="stat-value">${this.isLoading ? 'Loading...' : this.formatBigInt(this.currentStake)}</span>
            </div>

            <div class="stat-row">
              <span class="stat-label">Your Weekly Rewards</span>
              <span class="stat-value">${this.isLoading ? 'Loading...' : this.formatBigInt(this.userWeeklyRewards)}</span>
            </div>
          `
        : ""
      }

          <div class="stat-row">
            <span class="stat-label">Annual Stake APR</span>
            <span class="stat-value">${this.isLoading ? 'Loading...' : this.formatPercent(this.annualAPR)}</span>
          </div>
        </div>
        ${this.txLoading || this.isClaiming ? html`<div class="overlay"></div>` : ''}
      </div>
    `;
  }

  private async refreshData() {
    if (!this.publicClient) {
      this.publicClient = createPublicClient({
        chain: celo,
        transport: http()
      }) as unknown as PublicClient;
    }

    if (this.web3Provider && this.web3Provider.isConnected) {
      this.walletClient = createWalletClient({
        chain: celo,
        transport: custom(this.web3Provider)
      });
      this.sdk = new GooddollarSavingsSDK(this.publicClient!, this.walletClient);
      await this.loadStats();

      const accounts = await this.web3Provider.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        this.userAddress = accounts[0];
        await this.loadUserStats();
      } else {
        this.resetUserStats();
      }
    } else {
      this.sdk = new GooddollarSavingsSDK(this.publicClient);
      await this.loadStats();
    }
  }

  private async loadStats() {
    if (!this.sdk) return;
    try {
      const globalStats = await this.sdk.getGlobalStats();
      this.totalStaked = globalStats.totalStaked;
      this.annualAPR = globalStats.annualAPR;
    } catch (error) {
      console.error('Error loading global stats:', error);
    }
  }

  private async loadUserStats() {
    if (!this.sdk || !this.userAddress) return;
    try {
      const userStats = await this.sdk.getUserStats()
      this.walletBalance = userStats.walletBalance;
      this.currentStake = userStats.currentStake;
      this.unclaimedRewards = userStats.unclaimedRewards;
      this.userWeeklyRewards = userStats.userWeeklyRewards;
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  }
  private resetUserStats() {
    this.walletBalance = 0n;
    this.currentStake = 0n;
    this.unclaimedRewards = 0n;
    this.userWeeklyRewards = 0n;
  }

  formatBigInt(num: bigint) {
    return Intl.NumberFormat().format(this.toEtherNumber(num));
  }
  toEtherNumber(num: bigint) {
    return Number(formatEther(num));
  }
  formatPercent(num: number) {
    return `${num.toFixed(2)}%`;
  }

  handleTabClick(tab: string) {
    this.activeTab = tab;
    this.inputError = '';
    this.transactionError = '';
  }

  handleMaxClick() {
    if (this.activeTab === "stake") {
      this.inputAmount = this.toEtherNumber(this.walletBalance).toString()
    } else {
      this.inputAmount = this.toEtherNumber(this.currentStake).toString()
    }
    this.inputError = '';
  }

  handleInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.inputAmount = input.value;
    this.validateInput();
  }

  private validateInput(force: boolean = false) {
    this.inputError = '';
    if (!this.inputAmount || this.inputAmount.trim() === '') {
      return;
    }

    // Check for invalid characters (only numbers and decimal point allowed)
    const validInputRegex = /^[0-9]*\.?[0-9]*$/;
    if (!validInputRegex.test(this.inputAmount)) {
      this.inputError = 'Invalid value';
      return;
    }

    const numValue = parseFloat(this.inputAmount);
    if (isNaN(numValue) || numValue < 0) {
      this.inputError = 'Invalid value';
      return;
    }
    if (numValue === 0 && force) {
      this.inputError = 'Please enter a valid amount';
      return;
    }

    if (this.activeTab === 'stake') {
      const inputAmountWei = parseEther(this.inputAmount);
      if (inputAmountWei > this.walletBalance) {
        this.inputError = 'Insufficient balance';
        return;
      }
    }

    if (this.activeTab === 'unstake') {
      const inputAmountWei = parseEther(this.inputAmount);
      if (inputAmountWei > this.currentStake) {
        this.inputError = 'Max amount exceeded';
        return;
      }
    }
  }

  handleConnectWallet() {
    if (this.connectWallet) {
      this.connectWallet();
    }
  }

  async handleStake() {
    if (!this.sdk || !this.userAddress) return;
    this.validateInput(true);
    if (this.inputError) {
      return;
    }

    try {
      this.txLoading = true;
      this.transactionError = '';
      const amount = parseEther(this.inputAmount);
      const receipt = await this.sdk.stake(amount);
      if (receipt.status === 'success') {
        await this.refreshData();
        this.inputAmount = '0.0';
        this.inputError = '';
        this.transactionError = '';
      }
    } catch (error: any) {
      console.error('Staking error:', error);
      this.transactionError = error.message || 'Staking failed';
    } finally {
      this.txLoading = false;
    }
  }

  async handleUnstake() {
    if (!this.sdk || !this.userAddress) return;
    this.validateInput(true);
    if (this.inputError) {
      return;
    }

    try {
      this.txLoading = true;
      this.transactionError = '';
      const amount = parseEther(this.inputAmount);
      const receipt = await this.sdk.unstake(amount);
      if (receipt.status === 'success') {
        await this.refreshData();
        this.inputAmount = '0.0';
        this.inputError = '';
        this.transactionError = '';
      }
    } catch (error: any) {
      console.error('Unstaking error:', error);
      this.transactionError = error.message || 'Unstaking failed';
    } finally {
      this.txLoading = false;
    }
  }

  async handleClaim() {
    if (!this.sdk || !this.userAddress) return;

    try {
      this.isClaiming = true;
      this.transactionError = '';
      const receipt = await this.sdk.claimReward();
      if (receipt.status === 'success') {
        await this.refreshData();
        this.transactionError = '';
      }
    } catch (error: any) {
      console.error('Claim error:', error);
      this.transactionError = error.message || 'Claim failed';
    } finally {
      this.isClaiming = false;
    }
  }
}
